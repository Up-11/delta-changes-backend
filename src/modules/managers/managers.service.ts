import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateManagerDto, UpdateManagerDto } from './dto';
import { extractIds } from '../../common/utils/extract-id.util';

@Injectable()
export class ManagersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.manager.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        media: {
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
    const manager = await this.prisma.manager.findUnique({
      where: { id },
      include: {
        media: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
      },
    });

    if (!manager) {
      throw new NotFoundException(`Manager with id ${id} not found`);
    }

    return manager;
  }

  async create(dto: CreateManagerDto) {
    const { mediaIds, ...managerData } = dto;

    const manager = await this.prisma.manager.create({
      data: {
        ...managerData,
      },
    });

    // Link media files to the manager
    const extractedMediaIds = extractIds(mediaIds);
    if (extractedMediaIds.length > 0) {
      await this.prisma.media.updateMany({
        where: { id: { in: extractedMediaIds } },
        data: { managerId: manager.id },
      });
    }

    return this.findOne(manager.id);
  }

  async update(id: string, dto: UpdateManagerDto) {
    await this.findOne(id);

    const { mediaIds, ...managerData } = dto;

    // Update media relations if provided
    if (mediaIds !== undefined) {
      const extractedMediaIds = extractIds(mediaIds);

      // Remove existing media relations for this manager
      await this.prisma.media.updateMany({
        where: { managerId: id },
        data: { managerId: null },
      });

      // If new mediaIds are provided, link them
      if (extractedMediaIds.length > 0) {
        await this.prisma.media.updateMany({
          where: { id: { in: extractedMediaIds } },
          data: { managerId: id },
        });
      }
    }

    await this.prisma.manager.update({
      where: { id },
      data: {
        ...managerData,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.manager.delete({
      where: { id },
    });
  }
}
