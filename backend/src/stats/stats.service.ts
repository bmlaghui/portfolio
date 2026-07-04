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
    const cached = await this.safe(() => this.redis.getJson<any>('admin:dashboard:v3'), null);
    if (cached) return cached;

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setUTCDate(now.getUTCDate() - 29);
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);
    const sixtyDaysAgo = new Date(thirtyDaysAgo);
    sixtyDaysAgo.setUTCDate(sixtyDaysAgo.getUTCDate() - 30);

    const [
      projects, experience, education, blog, skills, messages, unreadMessages,
      testimonials, subscribers, publishedProjects, publishedPosts, publishedTestimonials,
      events, skillGroups, recentProjects, recentPosts, recentMessages,
    ] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.experience.count(),
      this.prisma.education.count(),
      this.prisma.blogPost.count(),
      this.prisma.skill.count(),
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { read: false } }),
      this.prisma.testimonial.count(),
      this.prisma.newsletterSubscriber.count({ where: { active: true } }),
      this.prisma.project.count({ where: { published: true } }),
      this.prisma.blogPost.count({ where: { published: true } }),
      this.prisma.testimonial.count({ where: { published: true } }),
      this.safe(() => this.prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: sixtyDaysAgo } },
        select: { type: true, path: true, visitorHash: true, sessionId: true, device: true, createdAt: true },
      }), []),
      this.safe(() => this.prisma.skill.groupBy({ by: ['category'], _count: { _all: true } }), []),
      this.safe(() => this.prisma.project.findMany({ orderBy: { updatedAt: 'desc' }, take: 3, select: { title: true, updatedAt: true } }), []),
      this.safe(() => this.prisma.blogPost.findMany({ orderBy: { updatedAt: 'desc' }, take: 3, select: { title: true, updatedAt: true } }), []),
      this.safe(() => this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { name: true, createdAt: true } }), []),
    ]);

    const currentEvents = events.filter(event => event.createdAt >= thirtyDaysAgo);
    const previousEvents = events.filter(event => event.createdAt < thirtyDaysAgo);
    const currentViews = currentEvents.filter(event => event.type === 'page_view').length;
    const previousViews = previousEvents.filter(event => event.type === 'page_view').length;
    const interactions = currentEvents.filter(event => event.type !== 'page_view').length;
    const uniqueVisitors = new Set(currentEvents.map(event => event.visitorHash).filter(Boolean)).size;
    const uniqueSessions = new Set(currentEvents.map(event => event.sessionId).filter(Boolean)).size;
    const timeline = this.buildTimeline(currentEvents, thirtyDaysAgo, 14);
    const topPages = this.topPages(currentEvents);

    const published = publishedProjects + publishedPosts + publishedTestimonials;
    const publishable = projects + blog + testimonials;
    const stats = {
      projects, experience, education, blog, skills, messages, unreadMessages,
      testimonials, subscribers,
      pageViews: currentViews,
      uniqueVisitors,
      uniqueSessions,
      interactions,
      trafficGrowth: this.growth(currentViews, previousViews),
      publicationRate: publishable ? Math.round((published / publishable) * 100) : 0,
      traffic: { timeline, topPages },
      contentDistribution: [
        { label: 'Projets', value: projects, color: '#c084fc' },
        { label: 'Articles', value: blog, color: '#6366f1' },
        { label: 'Expériences', value: experience, color: '#22d3ee' },
        { label: 'Formations', value: education, color: '#f59e0b' },
        { label: 'Compétences', value: skills, color: '#4ade80' },
        { label: 'Témoignages', value: testimonials, color: '#f472b6' },
      ],
      skillCategories: skillGroups
        .map(group => ({ label: group.category, value: group._count._all }))
        .sort((a, b) => b.value - a.value),
      publicationStatus: {
        published,
        drafts: Math.max(0, publishable - published),
      },
      recentActivity: [
        ...recentProjects.map(item => ({ type: 'project', label: item.title, date: item.updatedAt })),
        ...recentPosts.map(item => ({ type: 'blog', label: item.title, date: item.updatedAt })),
        ...recentMessages.map(item => ({ type: 'message', label: `Message de ${item.name}`, date: item.createdAt })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6),
      updatedAt: now.toISOString(),
    };

    await this.safe(() => this.redis.setJson('admin:dashboard:v3', stats, 60), undefined);
    return stats;
  }

  private buildTimeline(events: { type: string; createdAt: Date }[], since: Date, days: number) {
    const start = new Date();
    start.setUTCDate(start.getUTCDate() - (days - 1));
    start.setUTCHours(0, 0, 0, 0);
    if (start < since) start.setTime(since.getTime());
    return Array.from({ length: days }, (_, index) => {
      const day = new Date(start);
      day.setUTCDate(start.getUTCDate() + index);
      const key = day.toISOString().slice(0, 10);
      const daily = events.filter(event => event.createdAt.toISOString().slice(0, 10) === key);
      return {
        date: key,
        label: day.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', timeZone: 'UTC' }),
        views: daily.filter(event => event.type === 'page_view').length,
        interactions: daily.filter(event => event.type !== 'page_view').length,
      };
    });
  }

  private topPages(events: { type: string; path: string | null }[]) {
    const counts = new Map<string, number>();
    events.filter(event => event.type === 'page_view' && event.path).forEach(event => {
      counts.set(event.path!, (counts.get(event.path!) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }

  private growth(current: number, previous: number) {
    if (!previous) return current ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  private async safe<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        operation(),
        new Promise<T>((_, reject) => {
          timer = setTimeout(() => reject(new Error('Optional data source timeout')), 2500);
        }),
      ]);
    } catch (error) {
      console.warn('[dashboard] Optional data source unavailable:', error instanceof Error ? error.message : error);
      return fallback;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
