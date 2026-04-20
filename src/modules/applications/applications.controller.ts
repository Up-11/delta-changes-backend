import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationDto, ApplicationResponseDto } from './dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications (admin only)' })
  findAll(): Promise<ApplicationResponseDto[]> {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application by id (admin only)' })
  findOne(@Param('id') id: string): Promise<ApplicationResponseDto> {
    return this.applicationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create application (public)' })
  create(
    @Body() dto: CreateApplicationDto,
    @Ip() ipAddress: string,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.create(dto, ipAddress);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application (admin only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete application (admin only)' })
  remove(@Param('id') id: string): Promise<ApplicationResponseDto> {
    return this.applicationsService.remove(id);
  }
}
