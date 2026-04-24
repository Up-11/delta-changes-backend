import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateObjectDto, UpdateObjectDto } from './dto';

@Injectable()
export class ObjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.object.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const object = await this.prisma.object.findUnique({
      where: { id },
      include: {
        banner: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
        masterPlan: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
      },
    });

    if (!object) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }

    return object;
  }

  async findBySlug(slug: string) {
    const object = await this.prisma.object.findUnique({
      where: { slug },
    });

    if (!object) {
      throw new NotFoundException(`Object with slug ${slug} not found`);
    }

    return object;
  }

  async create(dto: CreateObjectDto) {
    // Check if slug already exists
    const existing = await this.prisma.object.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(
        `Object with slug '${dto.slug}' already exists`,
      );
    }

    const { bannerId, masterPlanId, ...objectData } = dto;

    const object = await this.prisma.object.create({
      data: objectData,
    });

    // Link media files to the object
    if (bannerId) {
      await this.prisma.media.update({
        where: { id: bannerId },
        data: { objectBannerId: object.id },
      });
    }

    if (masterPlanId) {
      await this.prisma.media.update({
        where: { id: masterPlanId },
        data: { objectMasterPlanId: object.id },
      });
    }

    return this.findOne(object.id);
  }

  async update(id: string, dto: UpdateObjectDto) {
    await this.findOne(id);

    // If slug is being updated, check uniqueness
    if (dto.slug) {
      const existing = await this.prisma.object.findFirst({
        where: {
          slug: dto.slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Object with slug '${dto.slug}' already exists`,
        );
      }
    }

    const { bannerId, masterPlanId, ...objectData } = dto;

    // Update media relations if provided
    if (bannerId !== undefined) {
      await this.prisma.media
        .updateMany({
          where: { objectBannerId: id },
          data: { objectBannerId: null },
        })
        .catch(() => {});

      if (bannerId) {
        await this.prisma.media.update({
          where: { id: bannerId },
          data: { objectBannerId: id },
        });
      }
    }

    if (masterPlanId !== undefined) {
      await this.prisma.media
        .updateMany({
          where: { objectMasterPlanId: id },
          data: { objectMasterPlanId: null },
        })
        .catch(() => {});

      if (masterPlanId) {
        await this.prisma.media.update({
          where: { id: masterPlanId },
          data: { objectMasterPlanId: id },
        });
      }
    }

    return this.prisma.object.update({
      where: { id },
      data: objectData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.object.delete({
      where: { id },
    });
  }
}
