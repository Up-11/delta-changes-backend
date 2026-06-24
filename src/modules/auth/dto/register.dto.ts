import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Пароль (минимум 6 символов)' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ description: 'Имя' })
  @IsString()
  @MinLength(1)
  name!: string;
}
