import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { SupabaseExceptionFilter } from './common/supabase-exception.filter';
// other imports...

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new SupabaseExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

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
  SwaggerModule.setup('api', app, document);

  const outputPath = join(__dirname, '..', 'swagger-spec.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  logger.log('Swagger spec saved to swagger-spec.json');

  // Generate API client silently
  exec(
    `openapi-generator-cli generate -i ${outputPath} -g typescript-fetch -o ../dashboard/src/api-client > nul 2>&1`,
    (error) => {
      if (error) {
        logger.error('Failed to generate API client: ' + error.message);
      } else {
        logger.log('Frontend API client generated!');
      }
    },
  );

  await app.listen(3000);
  logger.log(
    '🚀 Nest application successfully started on http://localhost:3000',
  );
}
void bootstrap();
