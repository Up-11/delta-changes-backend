import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../core';
import { LoginDto, ChangePasswordDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }],
      },
    });

    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username: email,
        password: hashedPassword,
        name: dto.name.trim(),
        role: UserRole.USER,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const login = dto.username.trim().toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: login }, { email: login }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    if (dto.client === 'site' && user.role === UserRole.ADMIN) {
      throw new UnauthorizedException(
        'Администратор не может входить на сайт как пользователь',
      );
    }

   

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: {
    id: string;
    username: string;
    email: string | null;
    name: string | null;
    role: UserRole;
  }) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
