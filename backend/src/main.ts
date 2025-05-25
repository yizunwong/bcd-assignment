// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔧 Swagger config
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The backend API description')
    .setVersion('1.0')
    .addTag('endpoints') // optional tags
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // localhost:3000/api

  await app.listen(3000);
}
bootstrap();
