import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { QueryOptionsDto } from '../common/dto/query-options.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOptionsDto) {
    const { page = 1, limit = 10, search, sortBy = 'order', sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.project.count({ where }),
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

  findPublished() {
    return this.prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.project.findUniqueOrThrow({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.project.findFirstOrThrow({
      where: { slug, published: true },
    });
  }

  create(dto: CreateProjectDto) {
    const slug = dto.slug || this.slugify(dto.title);
    return this.prisma.project.create({ data: { ...dto, slug } });
  }

  update(id: number, dto: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }

  async reorder(ids: number[]) {
    await Promise.all(
      ids.map((id, index) =>
        this.prisma.project.update({ where: { id }, data: { order: index } }),
      ),
    );
    return this.findAll({ page: 1, limit: 100 });
  }

  private slugify(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
