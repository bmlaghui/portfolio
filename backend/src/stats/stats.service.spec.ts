import { StatsService } from './stats.service';

describe('StatsService', () => {
  it('returns CMS statistics when cache and analytics are unavailable', async () => {
    const model = {
      count: jest.fn().mockResolvedValue(0),
      findMany: jest.fn().mockResolvedValue([]),
    };
    const prisma = {
      project: { ...model, count: jest.fn().mockResolvedValue(3) },
      experience: { count: jest.fn().mockResolvedValue(2) },
      education: { count: jest.fn().mockResolvedValue(1) },
      blogPost: { ...model, count: jest.fn().mockResolvedValue(4) },
      skill: {
        count: jest.fn().mockResolvedValue(5),
        groupBy: jest.fn().mockResolvedValue([{ category: 'Frontend', _count: { _all: 3 } }]),
      },
      contactMessage: { ...model, count: jest.fn().mockResolvedValue(2) },
      testimonial: { count: jest.fn().mockResolvedValue(1) },
      newsletterSubscriber: { count: jest.fn().mockResolvedValue(0) },
      analyticsEvent: { findMany: jest.fn().mockRejectedValue(new Error('analytics table unavailable')) },
    };
    const redis = {
      getJson: jest.fn().mockRejectedValue(new Error('redis unavailable')),
      setJson: jest.fn().mockRejectedValue(new Error('redis unavailable')),
    };

    const stats = await new StatsService(prisma as any, redis as any).getDashboardStats();

    expect(stats.projects).toBe(3);
    expect(stats.blog).toBe(4);
    expect(stats.pageViews).toBe(0);
    expect(stats.traffic.timeline).toHaveLength(14);
    expect(stats.skillCategories).toEqual([{ label: 'Frontend', value: 3 }]);
  });
});
