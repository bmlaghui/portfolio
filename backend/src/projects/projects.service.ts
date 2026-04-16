import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { order: 'asc' }
    });
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.project.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.project.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
