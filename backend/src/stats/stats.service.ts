import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getDashboardStats() {
    const cached = await this.redis.getJson<any>('admin:stats');
    if (cached) return cached;

    const [projects, experience, education, blog, skills, messages, unreadMessages] =
      await Promise.all([
        this.prisma.project.count(),
        this.prisma.experience.count(),
        this.prisma.education.count(),
        this.prisma.blogPost.count(),
        this.prisma.skill.count(),
        this.prisma.contactMessage.count(),
        this.prisma.contactMessage.count({ where: { read: false } }),
      ]);

    const stats = {
      projects,
      experience,
      education,
      blog,
      skills,
      messages,
      unreadMessages,
      updatedAt: new Date().toISOString(),
    };

    await this.redis.setJson('admin:stats', stats, 60); // Cache 60s
    return stats;
  }
}
