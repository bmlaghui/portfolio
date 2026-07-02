import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('education')
export class EducationController {
  constructor(private readonly service: EducationService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Post() @UseGuards(AuthGuard('jwt')) create(@Body() dto: CreateEducationDto) { return this.service.create(dto); }
  @Patch(':id') @UseGuards(AuthGuard('jwt')) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEducationDto) { return this.service.update(id, dto); }
  @Delete(':id') @UseGuards(AuthGuard('jwt')) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
