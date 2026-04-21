import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';

export class BannerResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  mainText!: string;

  @ApiProperty({ nullable: true })
  subText!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: () => [MediaDto] })
  media!: MediaDto[];
}

export class MediaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty({ enum: MediaType })
  type!: MediaType;
}
