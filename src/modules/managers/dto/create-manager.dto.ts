import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateManagerDto {
  @ApiProperty({ description: 'Имя менеджера' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Должность' })
  @IsString()
  position: string;

  @ApiPropertyOptional({ description: 'Телефон' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Руководитель ли', default: false })
  @IsOptional()
  @IsBoolean()
  isHead?: boolean;

  @ApiPropertyOptional({ description: 'Активен ли', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Порядок сортировки', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'ID медиа-файла (фото)', type: [String] })
  @IsOptional()
  @IsString({ each: true })
  mediaIds?: string[];
}
