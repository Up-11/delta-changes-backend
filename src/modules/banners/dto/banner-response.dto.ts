import { ApiProperty } from '@nestjs/swagger';

export class BannerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mainText: string;

  @ApiProperty({ nullable: true })
  subText: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [MediaDto] })
  media: MediaDto[];
}

export class MediaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  type: string;
}
