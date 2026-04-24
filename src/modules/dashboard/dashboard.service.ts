import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [objectsCount, apartmentsCount, applicationsCount, newsCount] =
      await Promise.all([
        this.prisma.object.count(),
        this.prisma.apartment.count(),
        this.prisma.application.count(),
        this.prisma.news.count(),
      ]);

    return {
      objects: objectsCount,
      apartments: apartmentsCount,
      applications: applicationsCount,
      news: newsCount,
    };
  }

  async getRecentApplications() {
    return this.prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  }
}
