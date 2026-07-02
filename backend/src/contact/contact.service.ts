import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto as ContactDto } from './dto/contact.dto';
import { QueryOptionsDto } from '../common/dto/query-options.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOptionsDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      (this.prisma as any).contactMessage.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      (this.prisma as any).contactMessage.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUnreadCount() {
    return (this.prisma as any).contactMessage.count({ where: { read: false } });
  }

  async create(dto: ContactDto) {
    return (this.prisma as any).contactMessage.create({ data: dto });
  }

  async markRead(id: number) {
    return (this.prisma as any).contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  async remove(id: number) {
    return (this.prisma as any).contactMessage.delete({ where: { id } });
  }
}
