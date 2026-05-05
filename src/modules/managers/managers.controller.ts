import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ManagersService } from './managers.service';
import { CreateManagerDto, UpdateManagerDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Managers (Отдел продаж)')
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить всех менеджеров' })
  findAll() {
    return this.managersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить менеджера по ID' })
  findOne(@Param('id') id: string) {
    return this.managersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать менеджера (Admin)' })
  create(@Body() dto: CreateManagerDto) {
    return this.managersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить менеджера (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateManagerDto) {
    return this.managersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить менеджера (Admin)' })
  remove(@Param('id') id: string) {
    return this.managersService.remove(id);
  }
}
