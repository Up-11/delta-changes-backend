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
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto, NewsResponseDto } from './dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published news (public)' })
  findAll(): Promise<NewsResponseDto[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news by id (public)' })
  findOne(@Param('id') id: string): Promise<NewsResponseDto> {
    return this.newsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get news by slug (public)' })
  findBySlug(@Param('slug') slug: string): Promise<NewsResponseDto> {
    return this.newsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create news (admin only)' })
  create(@Body() dto: CreateNewsDto): Promise<NewsResponseDto> {
    return this.newsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update news (admin only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
  ): Promise<NewsResponseDto> {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete news (admin only)' })
  remove(@Param('id') id: string): Promise<NewsResponseDto> {
    return this.newsService.remove(id);
  }
}
