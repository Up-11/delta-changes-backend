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
import { ApartmentsService } from './apartments.service';
import {
  CreateApartmentDto,
  UpdateApartmentDto,
  ApartmentResponseDto,
} from './dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available apartments (public)' })
  findAll(): Promise<ApartmentResponseDto[]> {
    return this.apartmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get apartment by id (public)' })
  findOne(@Param('id') id: string): Promise<ApartmentResponseDto> {
    return this.apartmentsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create apartment (admin only)' })
  create(@Body() dto: CreateApartmentDto): Promise<ApartmentResponseDto> {
    return this.apartmentsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update apartment (admin only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateApartmentDto,
  ): Promise<ApartmentResponseDto> {
    return this.apartmentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete apartment (admin only)' })
  remove(@Param('id') id: string): Promise<ApartmentResponseDto> {
    return this.apartmentsService.remove(id);
  }
}
