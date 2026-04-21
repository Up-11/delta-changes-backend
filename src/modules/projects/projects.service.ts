import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return project;
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }

    return project;
  }

  async create(dto: CreateProjectDto) {
    // Check if slug already exists
    const existing = await this.prisma.project.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(
        `Project with slug '${dto.slug}' already exists`,
      );
    }

    return this.prisma.project.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);

    // If slug is being updated, check uniqueness
    if (dto.slug) {
      const existing = await this.prisma.project.findFirst({
        where: {
          slug: dto.slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Project with slug '${dto.slug}' already exists`,
        );
      }
    }

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
