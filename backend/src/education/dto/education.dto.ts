import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateEducationDto {
  @IsString() school: string;
  @IsString() degree: string;
  @IsString() field: string;
  @IsDateString() startDate: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}
