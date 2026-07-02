import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
import { QueryOptionsDto } from '../common/dto/query-options.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOptionsDto) {
    const { page = 1, limit = 10, search, sortBy = 'startDate', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { company: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.experience.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.experience.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.prisma.experience.findUniqueOrThrow({ where: { id } });
  }

  create(dto: CreateExperienceDto) {
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.experience.create({ data });
  }

  update(id: number, dto: UpdateExperienceDto) {
    const data: any = { ...dto };
    if ((dto as any).startDate) data.startDate = new Date((dto as any).startDate);
    if ((dto as any).endDate) data.endDate = new Date((dto as any).endDate);
    return this.prisma.experience.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.experience.delete({ where: { id } });
  }
}
