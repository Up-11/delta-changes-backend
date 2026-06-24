import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, RolesGuard],
  exports: [FavoritesService],
})
export class FavoritesModule {}
