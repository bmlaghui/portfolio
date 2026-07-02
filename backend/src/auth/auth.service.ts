import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Store refresh token hash in DB
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access denied');

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!valid) throw new UnauthorizedException('Access denied');

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefresh },
    });

    return tokens;
  }

  async logout(userId: number, accessToken: string) {
    // Blacklist the access token in Redis (TTL = 15 min)
    await this.redis.set(`blacklist:${accessToken}`, '1', 900);

    // Clear refresh token in DB
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.redis.exists(`blacklist:${token}`);
  }

  async seedAdminUser() {
    const email = 'admin@portfolio.com';
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!existing) {
      const hashed = await bcrypt.hash('Admin123!', 12);
      await this.prisma.user.create({
        data: {
          email,
          password: hashed,
          name: 'Brahim Laghui',
          role: 'SUPER_ADMIN',
        },
      });
      console.log(`✅ Admin user seeded: ${email} / Admin123!`);
    } else {
      console.log(`ℹ️ Admin user already exists: ${email}`);
    }
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
