import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateBannerDto, UpdateBannerDto } from './dto';
import { extractId } from '../../common/utils/extract-id.util';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
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
    const banner = await this.prisma.banner.findUnique({
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

    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    return banner;
  }

  async create(dto: CreateBannerDto) {
    const { mediaId, ...bannerData } = dto;

    const banner = await this.prisma.banner.create({
      data: bannerData,
    });

    // If mediaId is provided, link it to the banner
    const extractedMediaId = extractId(mediaId);
    if (extractedMediaId) {
      await this.prisma.media.update({
        where: { id: extractedMediaId },
        data: { bannerId: banner.id },
      });
    }

    return this.findOne(banner.id);
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.findOne(id);

    const { mediaId, ...bannerData } = dto;

    // If mediaId is provided, update the media relation
    if (mediaId !== undefined) {
      // First, remove existing media relation for this banner
      await this.prisma.media.updateMany({
        where: { bannerId: id },
        data: { bannerId: null },
      });

      // Then, if a new mediaId is provided, link it
      const extractedMediaId = extractId(mediaId);
      if (extractedMediaId) {
        await this.prisma.media.update({
          where: { id: extractedMediaId },
          data: { bannerId: id },
        });
      }
    }

    await this.prisma.banner.update({
      where: { id },
      data: bannerData,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.banner.delete({
      where: { id },
      include: {
        media: true,
      },
    });
  }
}
