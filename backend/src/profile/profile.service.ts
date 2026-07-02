import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '../contact/dto/contact.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const profiles = await this.prisma.profile.findMany({ take: 1 });
    return profiles[0] || null;
  }

  async upsert(dto: UpdateProfileDto) {
    const existing = await this.prisma.profile.findMany({ take: 1 });
    if (existing.length > 0) {
      return this.prisma.profile.update({ where: { id: existing[0].id }, data: dto as any });
    }
    return this.prisma.profile.create({ data: { name: dto.name || '', title: dto.title || '', bio: dto.bio || '', ...dto } as any });
  }
}
