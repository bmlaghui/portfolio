import {
  Body, Controller, Get, Patch, Post, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  LoginDto,
  MfaDisableDto,
  MfaEnableDto,
  MfaSetupDto,
  UpdateAccountDto,
} from './dto/auth.dto';
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

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id);
  }

  @Patch('account')
  @UseGuards(AuthGuard('jwt'))
  updateAccount(@Req() req: any, @Body() dto: UpdateAccountDto) {
    return this.authService.updateAccount(req.user.id, dto);
  }

  @Patch('password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Post('mfa/setup')
  @UseGuards(AuthGuard('jwt'))
  setupMfa(@Req() req: any, @Body() dto: MfaSetupDto) {
    return this.authService.setupMfa(req.user.id, dto);
  }

  @Post('mfa/enable')
  @UseGuards(AuthGuard('jwt'))
  enableMfa(@Req() req: any, @Body() dto: MfaEnableDto) {
    return this.authService.enableMfa(req.user.id, dto);
  }

  @Post('mfa/disable')
  @UseGuards(AuthGuard('jwt'))
  disableMfa(@Req() req: any, @Body() dto: MfaDisableDto) {
    return this.authService.disableMfa(req.user.id, dto);
  }
}
