import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class TrackEventDto {
  @IsIn(['page_view', 'project_view', 'cv_view', 'outbound_click', 'contact_sent', 'newsletter_signup'])
  type: string;
  @IsOptional() @IsString() @MaxLength(40) resource?: string;
  @IsOptional() @IsString() @MaxLength(120) resourceId?: string;
  @IsOptional() @IsString() @MaxLength(300) path?: string;
  @IsOptional() @IsString() @MaxLength(64) visitorId?: string;
  @IsOptional() @IsString() @MaxLength(64) sessionId?: string;
  @IsOptional() @IsString() @MaxLength(300) referrer?: string;
  @IsOptional() @IsString() @MaxLength(20) device?: string;
}
