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
import { ObjectsService } from './objects.service';
import { CreateObjectDto, UpdateObjectDto, ObjectResponseDto } from './dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active objects (public)' })
  findAll(): Promise<ObjectResponseDto[]> {
    return this.objectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get object by id (public)' })
  findOne(@Param('id') id: string): Promise<ObjectResponseDto> {
    return this.objectsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get object by slug (public)' })
  findBySlug(@Param('slug') slug: string): Promise<ObjectResponseDto> {
    return this.objectsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create object (admin only)' })
  create(@Body() dto: CreateObjectDto): Promise<ObjectResponseDto> {
    return this.objectsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update object (admin only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateObjectDto,
  ): Promise<ObjectResponseDto> {
    return this.objectsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete object (admin only)' })
  remove(@Param('id') id: string): Promise<ObjectResponseDto> {
    return this.objectsService.remove(id);
  }
}
