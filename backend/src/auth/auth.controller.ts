import {
  Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@Req() req: any) {
    const user = req.user as any;
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.authService.refresh(user.id, token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  logout(@Req() req: any) {
    const user = req.user as any;
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) || '';
    return this.authService.logout(user.id, token);
  }
}
