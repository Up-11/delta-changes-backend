import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import {
  CreateApartmentDto,
  UpdateApartmentDto,
  FilterApartmentDto,
} from './dto';
import { Decimal } from '@prisma/client/runtime/library';
import { extractId } from '../../common/utils/extract-id.util';

@Injectable()
export class ApartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: FilterApartmentDto) {
    const where: any = {};

    if (filters) {
      if (filters.priceFrom !== undefined || filters.priceTo !== undefined) {
        where.price = {};
        if (filters.priceFrom !== undefined)
          where.price.gte = new Decimal(filters.priceFrom);
        if (filters.priceTo !== undefined)
          where.price.lte = new Decimal(filters.priceTo);
      }

      if (filters.areaFrom !== undefined || filters.areaTo !== undefined) {
        where.area = {};
        if (filters.areaFrom !== undefined) where.area.gte = filters.areaFrom;
        if (filters.areaTo !== undefined) where.area.lte = filters.areaTo;
      }

      if (filters.floorFrom !== undefined || filters.floorTo !== undefined) {
        where.floor = {};
        if (filters.floorFrom !== undefined)
          where.floor.gte = filters.floorFrom;
        if (filters.floorTo !== undefined) where.floor.lte = filters.floorTo;
      }

      if (filters.projectId) {
        where.projectId = filters.projectId;
      }

      if (filters.rooms !== undefined) {
        where.rooms = filters.rooms;
      }

      if (filters.search) {
        where.number = { contains: filters.search, mode: 'insensitive' };
      }
    }

    return this.prisma.apartment.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        project: true,
        object: true,
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
        project: true,
        object: true,
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
      price,
      completionDate,
      ...apartmentData
    } = dto;

    if (price === undefined || price === null) {
      throw new Error('Price is required');
    }

    // ✅ Handle completionDate - convert from ISO string to Date
    const apartmentDataWithDate = {
      ...apartmentData,
      price: new Decimal(price),
      ...(completionDate !== undefined && {
        completionDate: completionDate ? new Date(completionDate) : null,
      }),
    };

    const apartment = await this.prisma.apartment.create({
      data: apartmentDataWithDate,
    });

    // Link media files to the apartment
    const extractedLayoutPhotoId = extractId(layoutPhotoId);
    if (extractedLayoutPhotoId) {
      await this.prisma.media.update({
        where: { id: extractedLayoutPhotoId },
        data: { apartmentLayoutId: apartment.id },
      });
    }

    const extractedFloorPlanPhotoId = extractId(floorPlanPhotoId);
    if (extractedFloorPlanPhotoId) {
      await this.prisma.media.update({
        where: { id: extractedFloorPlanPhotoId },
        data: { apartmentFloorPlanId: apartment.id },
      });
    }

    const extractedMasterPlanPhotoId = extractId(masterPlanPhotoId);
    if (extractedMasterPlanPhotoId) {
      await this.prisma.media.update({
        where: { id: extractedMasterPlanPhotoId },
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
      price,
      completionDate,
      ...apartmentData
    } = dto;

    // Update media relations if provided
    const extractedLayoutPhotoId = extractId(layoutPhotoId);
    if (layoutPhotoId !== undefined) {
      await this.prisma.media
        .update({
          where: { apartmentLayoutId: id },
          data: { apartmentLayoutId: null },
        })
        .catch(() => {}); // Ignore if no existing relation

      if (extractedLayoutPhotoId) {
        await this.prisma.media.update({
          where: { id: extractedLayoutPhotoId },
          data: { apartmentLayoutId: id },
        });
      }
    }

    const extractedFloorPlanPhotoId = extractId(floorPlanPhotoId);
    if (floorPlanPhotoId !== undefined) {
      await this.prisma.media
        .update({
          where: { apartmentFloorPlanId: id },
          data: { apartmentFloorPlanId: null },
        })
        .catch(() => {});

      if (extractedFloorPlanPhotoId) {
        await this.prisma.media.update({
          where: { id: extractedFloorPlanPhotoId },
          data: { apartmentFloorPlanId: id },
        });
      }
    }

    const extractedMasterPlanPhotoId = extractId(masterPlanPhotoId);
    if (masterPlanPhotoId !== undefined) {
      await this.prisma.media
        .update({
          where: { apartmentMasterPlanId: id },
          data: { apartmentMasterPlanId: null },
        })
        .catch(() => {});

      if (extractedMasterPlanPhotoId) {
        await this.prisma.media.update({
          where: { id: extractedMasterPlanPhotoId },
          data: { apartmentMasterPlanId: id },
        });
      }
    }

    // ✅ Handle completionDate - convert from ISO string to Date
    const apartmentDataWithDate = {
      ...apartmentData,
      ...(price !== undefined && { price: new Decimal(price) }),
      ...(completionDate !== undefined && {
        completionDate: completionDate ? new Date(completionDate) : null,
      }),
    };

    return this.prisma.apartment.update({
      where: { id },
      data: apartmentDataWithDate,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.apartment.delete({
      where: { id },
    });
  }
}
