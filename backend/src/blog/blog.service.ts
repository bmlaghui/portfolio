import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog.dto';
import { QueryOptionsDto } from '../common/dto/query-options.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryOptionsDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  findPublished() {
    return this.prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  }

  findOne(slug: string) {
    return this.prisma.blogPost.findUniqueOrThrow({ where: { slug } });
  }

  findById(id: number) {
    return this.prisma.blogPost.findUniqueOrThrow({ where: { id } });
  }

  create(dto: CreateBlogPostDto) {
    const slug = dto.slug || this.slugify(dto.title);
    return this.prisma.blogPost.create({ data: { ...dto, slug, tags: dto.tags || [] } });
  }

  update(id: number, dto: UpdateBlogPostDto) {
    return this.prisma.blogPost.update({ where: { id }, data: dto });
  }

  remove(id: number) { return this.prisma.blogPost.delete({ where: { id } }); }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
