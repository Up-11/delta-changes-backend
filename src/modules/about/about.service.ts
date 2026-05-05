import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core';
import {
  UpdateAboutDto,
  CreateTimelineEventDto,
  CreateShareholderDto,
} from './dto/about.dto';
import { extractIds } from '../../common/utils/extract-id.util';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async getAbout() {
    let about = await this.prisma.aboutPage.findFirst({
      include: { media: true },
    });

    if (!about) {
      about = await this.prisma.aboutPage.create({
        data: {},
        include: { media: true },
      });
    }

    const timeline = await this.prisma.timelineEvent.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const shareholders = await this.prisma.shareholder.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return { about, timeline, shareholders };
  }

  async updateAbout(dto: UpdateAboutDto) {
    let about = await this.prisma.aboutPage.findFirst();
    const { mediaIds, ...data } = dto;

    // Create if doesn't exist
    if (!about) {
      about = await this.prisma.aboutPage.create({ data: {} });
    }

    const extractedMediaIds = extractIds(mediaIds);

    const updated = await this.prisma.aboutPage.update({
      where: { id: about.id },
      data: {
        ...data,
        media:
          extractedMediaIds.length > 0
            ? {
                set: extractedMediaIds.map((id) => ({ id })),
              }
            : undefined,
      },
      include: { media: true },
    });

    return updated;
  }

  async createTimelineEvent(dto: CreateTimelineEventDto) {
    return this.prisma.timelineEvent.create({ data: dto });
  }

  async updateTimelineEvent(id: string, dto: Partial<CreateTimelineEventDto>) {
    return this.prisma.timelineEvent.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTimelineEvent(id: string) {
    return this.prisma.timelineEvent.delete({ where: { id } });
  }

  async createShareholder(dto: CreateShareholderDto) {
    return this.prisma.shareholder.create({ data: dto });
  }

  async updateShareholder(id: string, dto: Partial<CreateShareholderDto>) {
    return this.prisma.shareholder.update({
      where: { id },
      data: dto,
    });
  }

  async deleteShareholder(id: string) {
    return this.prisma.shareholder.delete({ where: { id } });
  }
}
