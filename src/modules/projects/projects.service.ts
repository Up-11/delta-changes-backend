import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { extractId } from '../../common/utils/extract-id.util';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
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
    const project = await this.prisma.project.findUnique({
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

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return project;
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
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

    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }

    return project;
  }

  async create(dto: CreateProjectDto) {
    const { mediaId, ...data } = dto;
    // Check if slug already exists
    const existing = await this.prisma.project.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ConflictException(
        `Project with slug '${data.slug}' already exists`,
      );
    }

    const extractedMediaId = extractId(mediaId);

    return this.prisma.project.create({
      data: {
        ...data,
        media: extractedMediaId
          ? {
              connect: { id: extractedMediaId },
            }
          : undefined,
      },
      include: {
        media: true,
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const { mediaId, ...data } = dto;
    await this.findOne(id);

    // If slug is being updated, check uniqueness
    if (data.slug) {
      const existing = await this.prisma.project.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Project with slug '${data.slug}' already exists`,
        );
      }
    }

    const extractedMediaId = extractId(mediaId);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        media: extractedMediaId
          ? {
              set: { id: extractedMediaId },
            }
          : undefined,
      },
      include: {
        media: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
