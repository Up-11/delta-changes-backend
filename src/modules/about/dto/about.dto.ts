import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  announcement?: string;

  @IsString()
  @IsOptional()
  stat1Value?: string;

  @IsString()
  @IsOptional()
  stat1Label?: string;

  @IsString()
  @IsOptional()
  stat2Value?: string;

  @IsString()
  @IsOptional()
  stat2Label?: string;

  @IsString()
  @IsOptional()
  stat3Value?: string;

  @IsString()
  @IsOptional()
  stat3Label?: string;

  @IsString()
  @IsOptional()
  stat4Value?: string;

  @IsString()
  @IsOptional()
  stat4Label?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaIds?: string[];
}

export class CreateTimelineEventDto {
  @IsString()
  year: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class CreateShareholderDto {
  @IsString()
  name: string;

  @IsString()
  position: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
