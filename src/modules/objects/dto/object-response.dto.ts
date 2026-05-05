import { ApiProperty } from '@nestjs/swagger';
import { FinishingType } from '@prisma/client';

export class ObjectResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ nullable: true })
  latitude!: number | null;

  @ApiProperty({ nullable: true })
  longitude!: number | null;

  @ApiProperty({ nullable: true })
  address!: string | null;

  @ApiProperty({ nullable: true })
  completionDate!: Date | null;

  @ApiProperty({ nullable: true })
  floors!: number | null;

  @ApiProperty({ nullable: true, enum: FinishingType })
  finishing!: FinishingType | null;

  @ApiProperty({ nullable: true })
  conceptTitle!: string | null;

  @ApiProperty({ nullable: true })
  conceptText!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  projectId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
