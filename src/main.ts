import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- НАСТРОЙКА CORS ---
  app.enableCors({
    // Указываем адрес твоего Nuxt фронтенда
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      '*',
      'https://jvzp9vk6-5173.euw.devtunnels.ms',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Разрешаем передачу куки и заголовков авторизации
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Полезно для автоматического преобразования типов
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Delta Changes API')
    .setDescription('API documentation for Deltaстрой')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 4200;
  await app.listen(port);

  console.log(`🚀 Backend is running on: http://localhost:${port}/api`);
}
bootstrap();
