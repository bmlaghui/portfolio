import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  mfaCode?: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class UpdateAccountDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  currentPassword?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(10)
  @MaxLength(128)
  newPassword: string;
}

export class MfaSetupDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;
}

export class MfaEnableDto extends MfaSetupDto {
  @IsString()
  secret: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class MfaDisableDto extends MfaSetupDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  code: string;
}
