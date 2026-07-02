import { IsString, IsOptional, IsBoolean, IsInt, IsArray, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateExperienceDto {
  @IsString() company: string;
  @IsString() position: string;
  @IsOptional() @IsString() positionEn?: string;
  @IsDateString() startDate: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsBoolean() current?: boolean;
  @IsString() description: string;
  @IsOptional() @IsString() descriptionEn?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];
  @IsOptional() @IsInt() order?: number;
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
