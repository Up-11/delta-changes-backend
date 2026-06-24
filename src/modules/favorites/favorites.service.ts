import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core';

const apartmentInclude = {
  project: true,
  object: true,
  layoutPhoto: {
    select: { id: true, url: true, type: true },
  },
  floorPlanPhoto: {
    select: { id: true, url: true, type: true },
  },
  masterPlanPhoto: {
    select: { id: true, url: true, type: true },
  },
} as const;

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getApartmentIds(userId: string): Promise<string[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { apartmentId: true },
      orderBy: { createdAt: 'desc' },
    });
    return favorites.map((f) => f.apartmentId);
  }

  async findAll(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        apartment: {
          include: apartmentInclude,
        },
      },
    });

    return favorites.map((f) => ({
      id: f.id,
      apartmentId: f.apartmentId,
      createdAt: f.createdAt,
      apartment: f.apartment,
    }));
  }

  async add(userId: string, apartmentId: string) {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id: apartmentId },
    });

    if (!apartment) {
      throw new NotFoundException('Квартира не найдена');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_apartmentId: { userId, apartmentId },
      },
    });

    if (existing) {
      throw new ConflictException('Квартира уже в избранном');
    }

    return this.prisma.favorite.create({
      data: { userId, apartmentId },
      include: {
        apartment: { include: apartmentInclude },
      },
    });
  }

  async remove(userId: string, apartmentId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_apartmentId: { userId, apartmentId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Квартира не в избранном');
    }

    await this.prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return { message: 'Удалено из избранного' };
  }
}
