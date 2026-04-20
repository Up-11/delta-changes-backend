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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto, UpdateBannerDto, BannerResponseDto } from './dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active banners (public)' })
  findAll(): Promise<BannerResponseDto[]> {
    return this.bannersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by id (public)' })
  findOne(@Param('id') id: string): Promise<BannerResponseDto> {
    return this.bannersService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create banner (admin only)' })
  create(@Body() dto: CreateBannerDto): Promise<BannerResponseDto> {
    return this.bannersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update banner (admin only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto,
  ): Promise<BannerResponseDto> {
    return this.bannersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete banner (admin only)' })
  remove(@Param('id') id: string): Promise<BannerResponseDto> {
    return this.bannersService.remove(id);
  }
}
