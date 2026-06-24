import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- НАСТРОЙКА CORS ---
  // Читаем переменную и разбиваем строку по запятой в массив
  const origins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        '*',
        'https://jvzp9vk6-5173.euw.devtunnels.ms',
      ];

  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // --- ВАЛИДАЦИЯ ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // --- SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('Delta Changes API')
    .setDescription('API documentation for Deltaстрой')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // --- СТАТИКА (UPLOADS) ---
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // --- ЗАПУСК ---
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Backend is running on: http://localhost:${port}/api`);
}

bootstrap();
