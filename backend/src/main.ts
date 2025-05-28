// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { SupabaseExceptionFilter } from './common/supabase-exception.filter';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new SupabaseExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // 🔧 Swagger config
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The backend API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'Authorization',
        description: 'Enter your Supabase access token',
        in: 'header',
      },
      'supabase-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // localhost:3000/api

  await app.listen(3000);
}
void bootstrap();
