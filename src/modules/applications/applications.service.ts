import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateApplicationDto, UpdateApplicationDto } from './dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    return application;
  }

  async create(dto: CreateApplicationDto, ipAddress?: string) {
    return this.prisma.application.create({
      data: {
        ...dto,
        ipAddress,
        status: ApplicationStatus.NEW,
      },
    });
  }

  async update(id: string, dto: UpdateApplicationDto) {
    await this.findOne(id);

    return this.prisma.application.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.application.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: ApplicationStatus) {
    await this.findOne(id);

    return this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }
}
