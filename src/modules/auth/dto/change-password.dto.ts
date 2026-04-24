import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Текущий пароль' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ description: 'Новый пароль', minLength: 4 })
  @IsString()
  @MinLength(4)
  newPassword!: string;
}
