import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { NewsStatus } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.news.findMany({
      where: { status: NewsStatus.PUBLISHED },
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
    const { mediaUrl, publishedAt, ...newsData } = dto;

    const slug = this.generateSlug(newsData.title);

    return this.prisma.news.create({
      data: {
        ...newsData,
        slug,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        media: mediaUrl
          ? {
              create: {
                url: mediaUrl,
                type: 'IMAGE',
                filename: mediaUrl.split('/').pop() || 'news.jpg',
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

  async update(id: string, dto: UpdateNewsDto) {
    await this.findOne(id);

    const { mediaUrl, publishedAt, ...newsData } = dto;

    return this.prisma.news.update({
      where: { id },
      data: {
        ...newsData,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
      include: {
        media: true,
      },
    });
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

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  }
}
