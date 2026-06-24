import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../core';
import { UpdateUserDto } from './dto';

const userPublicSelect = {
  id: true,
  username: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: { favorites: true },
  },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: userPublicSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (user.role === UserRole.ADMIN && dto.isActive === false) {
      throw new BadRequestException('Нельзя деактивировать администратора');
    }

    if (id === actorId && dto.isActive === false) {
      throw new BadRequestException('Нельзя деактивировать свой аккаунт');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: userPublicSelect,
    });
  }

  async remove(id: string, actorId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (id === actorId) {
      throw new BadRequestException('Нельзя удалить свой аккаунт');
    }

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Нельзя удалить администратора');
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Пользователь удалён' };
  }
}
