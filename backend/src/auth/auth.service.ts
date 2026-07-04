import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import {
  ChangePasswordDto,
  LoginDto,
  MfaDisableDto,
  MfaEnableDto,
  MfaSetupDto,
  UpdateAccountDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (user.mfaEnabled) {
      if (!dto.mfaCode) return { mfaRequired: true };
      if (!(await this.verifySecondFactor(user.id, dto.mfaCode))) {
        throw new UnauthorizedException('Code MFA invalide');
      }
    }

    return this.createSession(user);
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshToken || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number, accessToken: string) {
    await this.redis.set(`blacklist:${accessToken}`, '1', 900);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return this.safeUser(user);
  }

  async updateAccount(userId: number, dto: UpdateAccountDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const email = dto.email.toLowerCase().trim();
    if (email !== user.email.toLowerCase()) {
      if (!dto.currentPassword || !(await bcrypt.compare(dto.currentPassword, user.password))) {
        throw new ForbiddenException('Le mot de passe actuel est requis pour modifier l’email');
      }
    }
    const existing = await this.prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (existing) throw new ConflictException('Cette adresse email est déjà utilisée');

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { name: dto.name.trim(), email },
    });
    return this.safeUser(updated);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.requirePassword(userId, dto.currentPassword);
    if (await bcrypt.compare(dto.newPassword, user.password)) {
      throw new ConflictException('Le nouveau mot de passe doit être différent');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: await bcrypt.hash(dto.newPassword, 12),
        refreshToken: null,
      },
    });
    return { message: 'Mot de passe modifié' };
  }

  async setupMfa(userId: number, dto: MfaSetupDto) {
    const user = await this.requirePassword(userId, dto.currentPassword);
    if (user.mfaEnabled) throw new ConflictException('Le MFA est déjà activé');

    const secret = this.base32Encode(crypto.randomBytes(20));
    const issuer = encodeURIComponent('Portfolio Admin');
    const account = encodeURIComponent(user.email);
    const uri = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
    const qrCode = await QRCode.toDataURL(uri, {
      width: 260,
      margin: 1,
      color: { dark: '#080808', light: '#ffffff' },
    });
    return { secret, qrCode };
  }

  async enableMfa(userId: number, dto: MfaEnableDto) {
    const user = await this.requirePassword(userId, dto.currentPassword);
    if (user.mfaEnabled) throw new ConflictException('Le MFA est déjà activé');
    if (!this.verifyTotp(dto.secret, dto.code)) {
      throw new ForbiddenException('Code de vérification invalide');
    }

    const recoveryCodes = this.generateRecoveryCodes();
    const recoveryHashes = await Promise.all(recoveryCodes.map(code => bcrypt.hash(code, 10)));
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
        mfaSecret: this.encrypt(dto.secret),
        mfaRecoveryCodes: recoveryHashes,
      },
    });
    return { enabled: true, recoveryCodes };
  }

  async disableMfa(userId: number, dto: MfaDisableDto) {
    await this.requirePassword(userId, dto.currentPassword);
    if (!(await this.verifySecondFactor(userId, dto.code))) {
      throw new ForbiddenException('Code MFA invalide');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: false, mfaSecret: null, mfaRecoveryCodes: [] },
    });
    return { enabled: false };
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.redis.exists(`blacklist:${token}`);
  }

  async seedAdminUser() {
    const email = 'admin@portfolio.com';
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (!existing) {
      const hashed = await bcrypt.hash('Admin123!', 12);
      await this.prisma.user.create({
        data: { email, password: hashed, name: 'Brahim Laghui', role: 'SUPER_ADMIN' },
      });
      console.log(`✅ Admin user seeded: ${email} / Admin123!`);
    } else {
      console.log(`ℹ️ Admin user already exists: ${email}`);
    }
  }

  private async createSession(user: any) {
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return { ...tokens, user: this.safeUser(user) };
  }

  private async storeRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    });
  }

  private async requirePassword(userId: number, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('Mot de passe actuel incorrect');
    }
    return user;
  }

  private safeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async verifySecondFactor(userId: number, credential: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mfaEnabled || !user.mfaSecret) return false;
    const normalized = credential.replace(/\s/g, '').toUpperCase();
    if (/^\d{6}$/.test(normalized)) {
      return this.verifyTotp(this.decrypt(user.mfaSecret), normalized);
    }
    for (let index = 0; index < user.mfaRecoveryCodes.length; index += 1) {
      if (await bcrypt.compare(normalized, user.mfaRecoveryCodes[index])) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { mfaRecoveryCodes: user.mfaRecoveryCodes.filter((_, i) => i !== index) },
        });
        return true;
      }
    }
    return false;
  }

  private generateRecoveryCodes() {
    return Array.from({ length: 8 }, () => {
      const value = crypto.randomBytes(5).toString('hex').toUpperCase();
      return `${value.slice(0, 5)}-${value.slice(5)}`;
    });
  }

  private verifyTotp(secret: string, code: string) {
    const counter = Math.floor(Date.now() / 1000 / 30);
    return [-1, 0, 1].some(offset => this.totp(secret, counter + offset) === code);
  }

  private totp(secret: string, counter: number) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64BE(BigInt(counter));
    const digest = crypto.createHmac('sha1', this.base32Decode(secret)).update(buffer).digest();
    const offset = digest[digest.length - 1] & 0x0f;
    const value = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
    return value.toString().padStart(6, '0');
  }

  private base32Encode(input: Buffer) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (const byte of input) bits += byte.toString(2).padStart(8, '0');
    let output = '';
    for (let i = 0; i < bits.length; i += 5) {
      output += alphabet[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)];
    }
    return output;
  }

  private base32Decode(input: string) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (const char of input.replace(/=+$/, '').toUpperCase()) {
      const value = alphabet.indexOf(char);
      if (value >= 0) bits += value.toString(2).padStart(5, '0');
    }
    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
    return Buffer.from(bytes);
  }

  private encryptionKey() {
    const source = process.env.MFA_ENCRYPTION_KEY || process.env.JWT_SECRET;
    if (!source) throw new Error('MFA_ENCRYPTION_KEY or JWT_SECRET is required');
    return crypto.scryptSync(source, 'portfolio-admin-mfa', 32);
  }

  private encrypt(value: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey(), iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}.${cipher.getAuthTag().toString('hex')}.${encrypted.toString('hex')}`;
  }

  private decrypt(value: string) {
    const [ivHex, tagHex, dataHex] = value.split('.');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '15m' }),
      this.jwt.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
  }
}
