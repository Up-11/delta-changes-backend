import { Module } from '@nestjs/common';
import { CoreModule } from './core';
import { BannersModule, NewsModule, ApplicationsModule } from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CoreModule, BannersModule, NewsModule, ApplicationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
