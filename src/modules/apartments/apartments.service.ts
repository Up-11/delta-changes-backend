import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateApartmentDto, UpdateApartmentDto } from './dto';

@Injectable()
export class ApartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.apartment.findMany({
      where: { isAvailable: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id },
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with id ${id} not found`);
    }

    return apartment;
  }

  async create(dto: CreateApartmentDto) {
    return this.prisma.apartment.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateApartmentDto) {
    await this.findOne(id);

    return this.prisma.apartment.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.apartment.delete({
      where: { id },
    });
  }
}
