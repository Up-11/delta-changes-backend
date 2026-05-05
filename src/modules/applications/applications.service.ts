import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateApplicationDto, UpdateApplicationDto } from './dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const applications = await this.prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        apartment: {
          select: {
            id: true,
            number: true,
            rooms: true,
            area: true,
            price: true,
            floor: true,
            building: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            object: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return applications.map((app) => ({
      ...app,
      message: app.comment,
    }));
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        apartment: {
          select: {
            id: true,
            number: true,
            rooms: true,
            area: true,
            price: true,
            floor: true,
            building: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            object: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    return {
      ...application,
      message: application.comment,
    };
  }

  async create(dto: CreateApplicationDto, ipAddress?: string) {
    const application = await this.prisma.application.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        comment: dto.message,
        apartmentId: dto.apartmentId,
        source: dto.source || 'website',
        ipAddress,
        status: ApplicationStatus.NEW,
      },
      include: {
        apartment: {
          select: {
            id: true,
            number: true,
            rooms: true,
            area: true,
            price: true,
            floor: true,
            building: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            object: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return {
      ...application,
      message: application.comment,
    };
  }

  async update(id: string, dto: UpdateApplicationDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.message !== undefined) {
      data.comment = dto.message;
      delete data.message;
    }

    const application = await this.prisma.application.update({
      where: { id },
      data,
    });

    return {
      ...application,
      message: application.comment,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.application.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: ApplicationStatus) {
    const application = await this.findOne(id);

    // If status is APPROVED and apartment is linked, mark apartment as unavailable
    if (status === ApplicationStatus.APPROVED && application.apartmentId) {
      await this.prisma.apartment.update({
        where: { id: application.apartmentId },
        data: { isAvailable: false },
      });
    }

    return this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }
}
