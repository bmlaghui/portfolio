import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class SubscribeNewsletterDto {
  @IsEmail() email: string;
  @IsOptional() @IsIn(['fr', 'en']) language?: 'fr' | 'en';
}
