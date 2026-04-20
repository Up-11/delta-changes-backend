import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateBannerDto, UpdateBannerDto } from './dto';

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
    const { mediaUrl, ...bannerData } = dto;

    return this.prisma.banner.create({
      data: {
        ...bannerData,
        media: mediaUrl
          ? {
              create: {
                url: mediaUrl,
                type: 'IMAGE',
                filename: mediaUrl.split('/').pop() || 'banner.jpg',
                mimeType: 'image/jpeg',
                size: 0,
              },
            }
          : undefined,
      },
      include: {
        media: true,
      },
    });
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.findOne(id);

    const { mediaUrl, ...bannerData } = dto;

    return this.prisma.banner.update({
      where: { id },
      data: bannerData,
      include: {
        media: true,
      },
    });
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
