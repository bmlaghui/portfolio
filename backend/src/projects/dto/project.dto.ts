import { IsString, IsOptional, IsArray, IsBoolean, IsInt } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProjectDto {
  @IsString() title: string;
  @IsOptional() @IsString() titleEn?: string;
  @IsString() description: string;
  @IsOptional() @IsString() descriptionEn?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() link?: string;
  @IsOptional() @IsString() github?: string;
  @IsArray() @IsString({ each: true }) tags: string[];
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsString() accent?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() challenge?: string;
  @IsOptional() @IsString() challengeEn?: string;
  @IsOptional() @IsString() solution?: string;
  @IsOptional() @IsString() solutionEn?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) results?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) resultsEn?: string[];
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) gallery?: string[];
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
