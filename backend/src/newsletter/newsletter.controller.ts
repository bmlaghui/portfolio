import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscribeNewsletterDto } from './dto/newsletter.dto';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}

  @Post()
  subscribe(@Body() dto: SubscribeNewsletterDto) { return this.service.subscribe(dto); }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() { return this.service.findAll(); }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
