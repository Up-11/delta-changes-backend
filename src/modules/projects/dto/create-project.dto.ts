import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Название проекта' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'URL-friendly идентификатор' })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ description: 'Описание проекта' })
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
}
