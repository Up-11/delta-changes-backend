import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Логин' })
  @IsString()
  username!: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString()
  password!: string;
}
