import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublished() {
    return this.prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  }

  findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  }

  create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data: dto });
  }

  update(id: number, dto: UpdateTestimonialDto) {
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.testimonial.delete({ where: { id } });
  }
}
