import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AboutService } from './about.service';
import {
  UpdateAboutDto,
  CreateTimelineEventDto,
  CreateShareholderDto,
} from './dto/about.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('About')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({ summary: 'Get about page data' })
  async getAbout() {
    return this.aboutService.getAbout();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  @ApiOperation({ summary: 'Update about page settings' })
  async updateAbout(@Body() dto: UpdateAboutDto) {
    return this.aboutService.updateAbout(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('timeline')
  @ApiOperation({ summary: 'Add timeline event' })
  async createTimelineEvent(@Body() dto: CreateTimelineEventDto) {
    return this.aboutService.createTimelineEvent(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('timeline/:id')
  @ApiOperation({ summary: 'Update timeline event' })
  async updateTimelineEvent(
    @Param('id') id: string,
    @Body() dto: Partial<CreateTimelineEventDto>,
  ) {
    return this.aboutService.updateTimelineEvent(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('timeline/:id')
  @ApiOperation({ summary: 'Delete timeline event' })
  async deleteTimelineEvent(@Param('id') id: string) {
    return this.aboutService.deleteTimelineEvent(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('shareholders')
  @ApiOperation({ summary: 'Add shareholder' })
  async createShareholder(@Body() dto: CreateShareholderDto) {
    return this.aboutService.createShareholder(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('shareholders/:id')
  @ApiOperation({ summary: 'Update shareholder' })
  async updateShareholder(
    @Param('id') id: string,
    @Body() dto: Partial<CreateShareholderDto>,
  ) {
    return this.aboutService.updateShareholder(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('shareholders/:id')
  @ApiOperation({ summary: 'Delete shareholder' })
  async deleteShareholder(@Param('id') id: string) {
    return this.aboutService.deleteShareholder(id);
  }
}
