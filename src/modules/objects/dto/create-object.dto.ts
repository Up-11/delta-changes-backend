import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FinishingType } from '@prisma/client';

export class CreateObjectDto {
  @ApiProperty({ description: 'Название объекта' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'URL-friendly идентификатор' })
  @IsString()
  slug!: string;

  @ApiProperty({ description: 'ID проекта' })
  @IsString()
  projectId!: string;

  @ApiPropertyOptional({ description: 'Широта' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Долгота' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Полный адрес' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Срок сдачи' })
  @IsOptional()
  @IsString()
  completionDate?: string;

  @ApiPropertyOptional({ description: 'Этажность' })
  @IsOptional()
  @IsInt()
  floors?: number;

  @ApiPropertyOptional({ description: 'Тип отделки', enum: FinishingType })
  @IsOptional()
  @IsEnum(FinishingType)
  finishing?: FinishingType;

  @ApiPropertyOptional({ description: 'Заголовок концепции' })
  @IsOptional()
  @IsString()
  conceptTitle?: string;

  @ApiPropertyOptional({ description: 'Текст концепции' })
  @IsOptional()
  @IsString()
  conceptText?: string;

  @ApiPropertyOptional({ description: 'Описание объекта' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Активен', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Порядок сортировки', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'ID фото баннера' })
  @IsOptional()
  @IsString()
  bannerId?: string;

  @ApiPropertyOptional({ description: 'ID фото генплана' })
  @IsOptional()
  @IsString()
  masterPlanId?: string;

  @ApiPropertyOptional({
    description: 'Массив ID медиа файлов',
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  mediaIds?: string[];

  @ApiPropertyOptional({
    description: 'Особенности проекта',
    type: [Object],
  })
  @IsOptional()
  features?: { title: string; description?: string; mediaIds?: string[] }[];

  @ApiPropertyOptional({
    description: 'Галереи проекта',
    type: [Object],
  })
  @IsOptional()
  galleries?: { title?: string; mediaIds?: string[] }[];

  @IsOptional()
  infrastructure?: any[];

  @IsOptional()
  constructionProgress?: any[];
}
