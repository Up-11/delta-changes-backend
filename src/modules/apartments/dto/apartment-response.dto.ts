import { ApiProperty } from '@nestjs/swagger';
import { FinishingType } from '@prisma/client';

export class ApartmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  number!: string;

  @ApiProperty()
  price!: any;

  @ApiProperty({ nullable: true })
  area!: number | null;

  @ApiProperty({ nullable: true })
  rooms!: number | null;

  @ApiProperty({ nullable: true })
  building!: string | null;

  @ApiProperty({ nullable: true })
  entrance!: string | null;

  @ApiProperty()
  floor!: number;

  @ApiProperty()
  floorTotal!: number;

  @ApiProperty({ nullable: true })
  completionDate!: Date | null;

  @ApiProperty({ nullable: true, enum: FinishingType })
  finishing!: FinishingType | null;

  @ApiProperty()
  isAvailable!: boolean;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  projectId!: string;

  @ApiProperty()
  objectId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
