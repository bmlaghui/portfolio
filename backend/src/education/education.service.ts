import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() { return this.prisma.education.findMany({ orderBy: { order: 'asc' } }); }
  findOne(id: number) { return this.prisma.education.findUniqueOrThrow({ where: { id } }); }
  create(dto: CreateEducationDto) {
    return this.prisma.education.create({
      data: { ...dto, startDate: new Date(dto.startDate), endDate: dto.endDate ? new Date(dto.endDate) : null },
    });
  }
  update(id: number, dto: UpdateEducationDto) {
    const data: any = { ...dto };
    if ((dto as any).startDate) data.startDate = new Date((dto as any).startDate);
    if ((dto as any).endDate) data.endDate = new Date((dto as any).endDate);
    return this.prisma.education.update({ where: { id }, data });
  }
  remove(id: number) { return this.prisma.education.delete({ where: { id } }); }
}
