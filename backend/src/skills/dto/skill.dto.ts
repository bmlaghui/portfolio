import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSkillDto {
  @IsString() name: string;
  @IsString() category: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) level?: number;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
