import { Controller, Get, Body, Patch, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from '../contact/dto/contact.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get() get() { return this.service.get(); }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  update(@Body() dto: UpdateProfileDto) { return this.service.upsert(dto); }
}
