import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';

export class FileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty({ enum: MediaType })
  type!: MediaType;

  @ApiProperty()
  filename!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  size!: number;

  @ApiProperty({ nullable: true })
  altText!: string | null;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  createdAt!: Date;
}

export class FilesResponseDto {
  @ApiProperty({ type: [FileResponseDto] })
  files!: FileResponseDto[];
}
