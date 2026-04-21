import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ description: 'Главный текст баннера' })
  @IsString()
  mainText!: string;

  @ApiPropertyOptional({ description: 'Вспомогательный текст' })
  @IsOptional()
  @IsString()
  subText?: string;

  @ApiPropertyOptional({ description: 'Активен ли баннер', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Порядок сортировки', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number = 0;
}
