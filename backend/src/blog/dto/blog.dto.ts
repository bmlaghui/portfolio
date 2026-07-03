import { IsString, IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBlogPostDto {
  @IsString() title: string;
  @IsOptional() @IsString() titleEn?: string;
  @IsString() summary: string;
  @IsOptional() @IsString() summaryEn?: string;
  @IsString() content: string;
  @IsOptional() @IsString() contentEn?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() readTime?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() blocks?: any;
}

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}
