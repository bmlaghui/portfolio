import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribeNewsletterDto } from './dto/newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  subscribe(dto: SubscribeNewsletterDto) {
    return this.prisma.newsletterSubscriber.upsert({
      where: { email: dto.email.toLowerCase() },
      update: { active: true, language: dto.language || 'fr' },
      create: { email: dto.email.toLowerCase(), language: dto.language || 'fr' },
    });
  }

  findAll() {
    return this.prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
  }

  remove(id: number) {
    return this.prisma.newsletterSubscriber.delete({ where: { id } });
  }
}
