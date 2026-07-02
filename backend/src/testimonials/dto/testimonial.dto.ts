import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTestimonialDto {
  @IsString() name: string;
  @IsString() role: string;
  @IsOptional() @IsString() company?: string;
  @IsString() quote: string;
  @IsOptional() @IsString() quoteEn?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
