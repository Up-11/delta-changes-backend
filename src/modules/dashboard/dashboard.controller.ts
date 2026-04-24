import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard statistics (admin only)' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-applications')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recent applications (admin only)' })
  getRecentApplications() {
    return this.dashboardService.getRecentApplications();
  }
}
