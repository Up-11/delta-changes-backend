import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoreModule } from './core';
import {
  BannersModule,
  NewsModule,
  ApplicationsModule,
  UploadsModule,
  ProjectsModule,
  ObjectsModule,
  ApartmentsModule,
  AuthModule,
  DashboardModule,
  ManagersModule,
  AboutModule,
} from './modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    CoreModule,
    BannersModule,
    NewsModule,
    ApplicationsModule,
    UploadsModule,
    ObjectsModule,
    ProjectsModule,
    ApartmentsModule,
    AuthModule,
    DashboardModule,
    ManagersModule,
    AboutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
