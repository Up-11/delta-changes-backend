import { ApiProperty } from '@nestjs/swagger';
import { NewsStatus, MediaType } from '@prisma/client';

export class NewsResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ nullable: true })
  excerpt!: string | null;

  @ApiProperty({ nullable: true })
  publishedAt!: Date | null;

  @ApiProperty({ enum: NewsStatus })
  status!: NewsStatus;

  @ApiProperty({ nullable: true })
  metaTitle!: string | null;

  @ApiProperty({ nullable: true })
  metaDesc!: string | null;

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
