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
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const object = await this.prisma.object.findUnique({
      where: { id },
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

    return this.prisma.object.create({
      data: dto,
    });
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

    return this.prisma.object.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.object.delete({
      where: { id },
    });
  }
}
