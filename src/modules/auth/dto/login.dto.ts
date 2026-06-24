import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Логин или email' })
  @IsString()
  username!: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString()
  password!: string;

  @ApiPropertyOptional({ enum: ['site', 'admin'], description: 'Контекст входа' })
  @IsOptional()
  @IsIn(['site', 'admin'])
  client?: 'site' | 'admin';
}
