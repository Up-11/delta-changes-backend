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

  @ApiPropertyOptional({ description: 'Улица' })
  @IsOptional()
  @IsString()
  street?: string;

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

  @ApiPropertyOptional({ description: 'Активен', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Порядок сортировки', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
