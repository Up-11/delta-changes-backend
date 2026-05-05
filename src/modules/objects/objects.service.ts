import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateObjectDto, UpdateObjectDto } from './dto';
import { extractId, extractIds } from '../../common/utils/extract-id.util';

@Injectable()
export class ObjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.object.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        media: {
          where: { objectId: { not: null } },
          orderBy: { sortOrder: 'asc' },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        apartments: {
          where: { isAvailable: true },
        },
      },
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
        media: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            url: true,
            type: true,
            altText: true,
          },
        },
        features: {
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
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
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
        media: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            url: true,
            type: true,
            altText: true,
          },
        },
        features: {
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
        },
        galleries: {
          orderBy: { sortOrder: 'asc' },
          include: {
            photos: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                url: true,
                type: true,
              },
            },
          },
        },
        constructionProgress: {
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          include: {
            media: {
              select: {
                id: true,
                url: true,
                type: true,
              },
            },
          },
        },
        infrastructure: {
          orderBy: { createdAt: 'asc' },
        },
        apartments: {
          where: { isAvailable: true },
          select: {
            id: true,
            price: true,
            rooms: true,
            area: true,
            floor: true,
            floorTotal: true,
          },
        },
      },
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

    const {
      bannerId,
      masterPlanId,
      mediaIds,
      features,
      galleries,
      infrastructure,
      constructionProgress,
      ...objectData
    } = dto;

    const object = await this.prisma.object.create({
      data: objectData as any,
    });

    const id = object.id;

    // Extract media IDs
    const extractedBannerId = extractId(bannerId);
    const extractedMasterPlanId = extractId(masterPlanId);
    const extractedMediaIds = extractIds(mediaIds);

    // Link media files to the object
    if (extractedBannerId) {
      await this.prisma.media.update({
        where: { id: extractedBannerId },
        data: { objectBannerId: id },
      });
    }

    if (extractedMasterPlanId) {
      await this.prisma.media.update({
        where: { id: extractedMasterPlanId },
        data: { objectMasterPlanId: id },
      });
    }

    // Link additional media files (Main Photo)
    if (extractedMediaIds.length > 0) {
      await this.prisma.media.updateMany({
        where: { id: { in: extractedMediaIds } },
        data: { objectId: id },
      });
    }

    // Create features
    if (features && features.length > 0) {
      for (const f of features) {
        const feature = await this.prisma.featureItem.create({
          data: {
            title: f.title,
            description: f.description,
            objectId: id,
          },
        });

        const extractedFeatureMediaIds = extractIds(f.mediaIds);
        if (extractedFeatureMediaIds.length > 0) {
          await this.prisma.media.updateMany({
            where: { id: { in: extractedFeatureMediaIds } },
            data: { featureId: feature.id },
          });
        }
      }
    }

    // Create galleries
    if (galleries && galleries.length > 0) {
      for (const g of galleries) {
        const gallery = await this.prisma.gallery.create({
          data: {
            title: g.title,
            objectId: id,
          },
        });

        const extractedGalleryMediaIds = extractIds(g.mediaIds);
        if (extractedGalleryMediaIds.length > 0) {
          await this.prisma.media.updateMany({
            where: { id: { in: extractedGalleryMediaIds } },
            data: { galleryId: gallery.id },
          });
        }
      }
    }

    return this.findOne(id);
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

    const {
      bannerId,
      masterPlanId,
      mediaIds,
      features,
      galleries,
      infrastructure,
      constructionProgress,
      ...objectData
    } = dto;

    // Extract media IDs
    const extractedBannerId = extractId(bannerId);
    const extractedMasterPlanId = extractId(masterPlanId);

    // Update media relations if provided
    if (bannerId !== undefined) {
      await this.prisma.media
        .updateMany({
          where: { objectBannerId: id },
          data: { objectBannerId: null },
        })
        .catch(() => {});

      if (extractedBannerId) {
        await this.prisma.media.update({
          where: { id: extractedBannerId },
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

      if (extractedMasterPlanId) {
        await this.prisma.media.update({
          where: { id: extractedMasterPlanId },
          data: { objectMasterPlanId: id },
        });
      }
    }

    // Update additional media files (Main Photo)
    if (mediaIds !== undefined) {
      const extractedMediaIds = extractIds(mediaIds);

      // Clear existing media relations
      await this.prisma.media
        .updateMany({
          where: { objectId: id },
          data: { objectId: null },
        })
        .catch(() => {});

      // Set new media relations
      if (extractedMediaIds.length > 0) {
        await this.prisma.media.updateMany({
          where: { id: { in: extractedMediaIds } },
          data: { objectId: id },
        });
      }
    }

    // Update features
    if (features !== undefined) {
      // Delete existing features
      await this.prisma.featureItem.deleteMany({
        where: { objectId: id },
      });

      // Create new features
      if (features && features.length > 0) {
        for (const f of features) {
          const feature = await this.prisma.featureItem.create({
            data: {
              title: f.title,
              description: f.description,
              objectId: id,
            },
          });

          const extractedFeatureMediaIds = extractIds(f.mediaIds);
          if (extractedFeatureMediaIds.length > 0) {
            await this.prisma.media.updateMany({
              where: { id: { in: extractedFeatureMediaIds } },
              data: { featureId: feature.id },
            });
          }
        }
      }
    }

    // Update galleries
    if (galleries !== undefined) {
      // Delete existing galleries
      await this.prisma.gallery.deleteMany({
        where: { objectId: id },
      });

      // Create new galleries
      if (galleries && galleries.length > 0) {
        for (const g of galleries) {
          const gallery = await this.prisma.gallery.create({
            data: {
              title: g.title,
              objectId: id,
            },
          });

          const extractedGalleryMediaIds = extractIds(g.mediaIds);
          if (extractedGalleryMediaIds.length > 0) {
            await this.prisma.media.updateMany({
              where: { id: { in: extractedGalleryMediaIds } },
              data: { galleryId: gallery.id },
            });
          }
        }
      }
    }

    return this.prisma.object.update({
      where: { id },
      data: objectData as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.object.delete({
      where: { id },
    });
  }
}
