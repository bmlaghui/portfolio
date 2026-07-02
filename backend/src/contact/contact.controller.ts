import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, ParseIntPipe, Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactMessageDto as ContactDto } from './dto/contact.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryOptionsDto } from '../common/dto/query-options.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() dto: ContactDto) {
    return this.contactService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: QueryOptionsDto) {
    return this.contactService.findAll(query);
  }

  @Get('unread')
  @UseGuards(AuthGuard('jwt'))
  getUnreadCount() {
    return this.contactService.getUnreadCount();
  }

  @Patch(':id/read')
  @UseGuards(AuthGuard('jwt'))
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.markRead(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.remove(id);
  }
}
