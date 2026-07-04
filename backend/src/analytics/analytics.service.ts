import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackEventDto } from './dto/analytics.dto';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  track(dto: TrackEventDto) {
    const { visitorId, ...event } = dto;
    const visitorHash = visitorId
      ? crypto.createHmac('sha256', process.env.ANALYTICS_SALT || process.env.JWT_SECRET || 'analytics')
          .update(visitorId)
          .digest('hex')
      : undefined;
    return this.prisma.analyticsEvent.create({
      data: { ...event, visitorHash },
      select: { id: true },
    });
  }

  async summary() {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const [total, byType, recent] = await Promise.all([
      this.prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
      this.prisma.analyticsEvent.groupBy({
        by: ['type'],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      }),
      this.prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);
    return {
      period: '30d',
      total,
      byType: Object.fromEntries(byType.map(item => [item.type, item._count._all])),
      recent,
    };
  }
}
