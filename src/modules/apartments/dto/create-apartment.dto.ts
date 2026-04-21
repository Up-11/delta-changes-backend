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

export class CreateApartmentDto {
  @ApiProperty({ description: 'Номер квартиры' })
  @IsString()
  number!: string;

  @ApiProperty({ description: 'Цена' })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: 'ID проекта' })
  @IsString()
  projectId!: string;

  @ApiProperty({ description: 'ID объекта (дома)' })
  @IsString()
  objectId!: string;

  @ApiPropertyOptional({ description: 'Общая площадь (м²)' })
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiPropertyOptional({ description: 'Количество комнат' })
  @IsOptional()
  @IsInt()
  rooms?: number;

  @ApiPropertyOptional({ description: 'Дом/корпус' })
  @IsOptional()
  @IsString()
  building?: string;

  @ApiPropertyOptional({ description: 'Подъезд' })
  @IsOptional()
  @IsString()
  entrance?: string;

  @ApiProperty({ description: 'Этаж' })
  @IsInt()
  floor!: number;

  @ApiProperty({ description: 'Всего этажей в доме' })
  @IsInt()
  floorTotal!: number;

  @ApiPropertyOptional({ description: 'Срок сдачи' })
  @IsOptional()
  @IsString()
  completionDate?: string;

  @ApiPropertyOptional({ description: 'Тип отделки', enum: FinishingType })
  @IsOptional()
  @IsEnum(FinishingType)
  finishing?: FinishingType;

  @ApiPropertyOptional({ description: 'В продаже', default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Порядок сортировки', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
