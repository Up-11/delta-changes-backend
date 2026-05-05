import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { extractIds } from '../../common/utils/extract-id.util';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
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
    const news = await this.prisma.news.findUnique({
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

    if (!news) {
      throw new NotFoundException(`News with id ${id} not found`);
    }

    return news;
  }

  async findBySlug(slug: string) {
    const news = await this.prisma.news.findUnique({
      where: { slug },
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

    if (!news) {
      throw new NotFoundException(`News with slug ${slug} not found`);
    }

    return news;
  }

  async create(dto: CreateNewsDto) {
    const { mediaIds, publishedAt, ...newsData } = dto;

    const news = await this.prisma.news.create({
      data: {
        ...newsData,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    // Link media files to the news
    const extractedMediaIds = extractIds(mediaIds);
    if (extractedMediaIds.length > 0) {
      await this.prisma.media.updateMany({
        where: { id: { in: extractedMediaIds } },
        data: { newsId: news.id },
      });
    }

    return this.findOne(news.id);
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.findOne(id);

    const { mediaIds, publishedAt, ...newsData } = dto;

    // Update media relations if provided
    if (mediaIds !== undefined) {
      const extractedMediaIds = extractIds(mediaIds);

      // Remove existing media relations for this news
      await this.prisma.media.updateMany({
        where: { newsId: id },
        data: { newsId: null },
      });

      // If new mediaIds are provided, link them
      if (extractedMediaIds.length > 0) {
        await this.prisma.media.updateMany({
          where: { id: { in: extractedMediaIds } },
          data: { newsId: id },
        });
      }
    }

    await this.prisma.news.update({
      where: { id },
      data: {
        ...newsData,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.news.delete({
      where: { id },
      include: {
        media: true,
      },
    });
  }
}
