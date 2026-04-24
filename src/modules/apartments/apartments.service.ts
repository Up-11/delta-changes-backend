import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateApartmentDto, UpdateApartmentDto } from './dto';

@Injectable()
export class ApartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.apartment.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        layoutPhoto: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
        floorPlanPhoto: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
        masterPlanPhoto: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id },
      include: {
        layoutPhoto: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
        floorPlanPhoto: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
        masterPlanPhoto: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
      },
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with id ${id} not found`);
    }

    return apartment;
  }

  async create(dto: CreateApartmentDto) {
    const {
      layoutPhotoId,
      floorPlanPhotoId,
      masterPlanPhotoId,
      ...apartmentData
    } = dto;

    const apartment = await this.prisma.apartment.create({
      data: apartmentData,
    });

    // Link media files to the apartment
    if (layoutPhotoId) {
      await this.prisma.media.update({
        where: { id: layoutPhotoId },
        data: { apartmentLayoutId: apartment.id },
      });
    }

    if (floorPlanPhotoId) {
      await this.prisma.media.update({
        where: { id: floorPlanPhotoId },
        data: { apartmentFloorPlanId: apartment.id },
      });
    }

    if (masterPlanPhotoId) {
      await this.prisma.media.update({
        where: { id: masterPlanPhotoId },
        data: { apartmentMasterPlanId: apartment.id },
      });
    }

    return this.findOne(apartment.id);
  }

  async update(id: string, dto: UpdateApartmentDto) {
    await this.findOne(id);

    const {
      layoutPhotoId,
      floorPlanPhotoId,
      masterPlanPhotoId,
      ...apartmentData
    } = dto;

    // Update media relations if provided
    if (layoutPhotoId !== undefined) {
      await this.prisma.media
        .update({
          where: { apartmentLayoutId: id },
          data: { apartmentLayoutId: null },
        })
        .catch(() => {}); // Ignore if no existing relation

      if (layoutPhotoId) {
        await this.prisma.media.update({
          where: { id: layoutPhotoId },
          data: { apartmentLayoutId: id },
        });
      }
    }

    if (floorPlanPhotoId !== undefined) {
      await this.prisma.media
        .update({
          where: { apartmentFloorPlanId: id },
          data: { apartmentFloorPlanId: null },
        })
        .catch(() => {});

      if (floorPlanPhotoId) {
        await this.prisma.media.update({
          where: { id: floorPlanPhotoId },
          data: { apartmentFloorPlanId: id },
        });
      }
    }

    if (masterPlanPhotoId !== undefined) {
      await this.prisma.media
        .update({
          where: { apartmentMasterPlanId: id },
          data: { apartmentMasterPlanId: null },
        })
        .catch(() => {});

      if (masterPlanPhotoId) {
        await this.prisma.media.update({
          where: { id: masterPlanPhotoId },
          data: { apartmentMasterPlanId: id },
        });
      }
    }

    await this.prisma.apartment.update({
      where: { id },
      data: apartmentData,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.apartment.delete({
      where: { id },
    });
  }
}
