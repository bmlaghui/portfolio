import { IsString, IsEmail, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateContactMessageDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() subject?: string;
  @IsString() message: string;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() titleEn?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() bioEn?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() available?: boolean;
  @IsOptional() socials?: Record<string, string>;
  @IsOptional() @IsString() cvUrl?: string;
}
