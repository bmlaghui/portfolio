import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/stats')
@UseGuards(AuthGuard('jwt'))
export class StatsController {
  constructor(private readonly service: StatsService) {}
  @Get() getDashboard() { return this.service.getDashboardStats(); }
}
