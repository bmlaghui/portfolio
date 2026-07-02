import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Post()
  track(@Body() dto: TrackEventDto) { return this.service.track(dto); }

  @Get('summary')
  @UseGuards(AuthGuard('jwt'))
  summary() { return this.service.summary(); }
}
