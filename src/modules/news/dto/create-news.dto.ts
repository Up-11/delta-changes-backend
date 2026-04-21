import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NewsStatus } from '@prisma/client';

export class CreateNewsDto {
  @ApiProperty({ description: 'Название новости' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'URL-friendly идентификатор' })
  @IsString()
  slug!: string;

  @ApiProperty({ description: 'Текст новости' })
  @IsString()
  content!: string;

  @ApiPropertyOptional({ description: 'Краткое описание' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ description: 'SEO заголовок' })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'SEO описание' })
  @IsOptional()
  @IsString()
  metaDesc?: string;

  @ApiPropertyOptional({ description: 'Дата публикации' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({
    description: 'Статус',
    enum: NewsStatus,
    default: NewsStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus = NewsStatus.DRAFT;
}
