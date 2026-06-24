import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('ids')
  @ApiOperation({ summary: 'Get favorite apartment IDs' })
  getIds(@Request() req: { user: { id: string } }) {
    return this.favoritesService.getApartmentIds(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get favorites with apartment details' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.favoritesService.findAll(req.user.id);
  }

  @Post(':apartmentId')
  @ApiOperation({ summary: 'Add apartment to favorites' })
  add(
    @Request() req: { user: { id: string } },
    @Param('apartmentId') apartmentId: string,
  ) {
    return this.favoritesService.add(req.user.id, apartmentId);
  }

  @Delete(':apartmentId')
  @ApiOperation({ summary: 'Remove apartment from favorites' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('apartmentId') apartmentId: string,
  ) {
    return this.favoritesService.remove(req.user.id, apartmentId);
  }
}
