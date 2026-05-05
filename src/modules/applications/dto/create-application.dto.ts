import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ description: 'Имя' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Телефон' })
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Сообщение / Комментарий' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'ID квартиры' })
  @IsOptional()
  @IsString()
  apartmentId?: string;

  @ApiPropertyOptional({ description: 'Источник заявки' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: 'Статус',
    enum: ApplicationStatus,
    default: ApplicationStatus.NEW,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus = ApplicationStatus.NEW;
}
