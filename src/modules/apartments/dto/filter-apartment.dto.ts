import { IsOptional, IsNumber, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterApartmentDto {
  @ApiPropertyOptional({ description: 'Минимальная цена' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceFrom?: number;

  @ApiPropertyOptional({ description: 'Максимальная цена' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceTo?: number;

  @ApiPropertyOptional({ description: 'Минимальная площадь' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  areaFrom?: number;

  @ApiPropertyOptional({ description: 'Максимальная площадь' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  areaTo?: number;

  @ApiPropertyOptional({ description: 'Минимальный этаж' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  floorFrom?: number;

  @ApiPropertyOptional({ description: 'Максимальный этаж' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  floorTo?: number;

  @ApiPropertyOptional({ description: 'ID проекта' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Количество комнат' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  rooms?: number;

  @ApiPropertyOptional({ description: 'Поисковый запрос (номер квартиры)' })
  @IsOptional()
  @IsString()
  search?: string;
}
