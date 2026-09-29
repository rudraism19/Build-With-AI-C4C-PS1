import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('JanSetuBootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Global API Prefix: /api/v1 (exclude swagger UI routes)
  app.setGlobalPrefix('api/v1', {
    exclude: ['api/docs', 'api/docs/(.*)'],
  });

  // Global Validation Pipe with strict validation rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS Configuration
  const rawCorsOrigins = configService.get<string>(
    'CORS_ORIGIN',
    'http://localhost:5173,http://localhost:3000',
  );
  const allowedOrigins = rawCorsOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Swagger Documentation Setup at /api/docs
  const config = new DocumentBuilder()
    .setTitle('JanSetu AI API')
    .setDescription(
      'Phase 1 REST API for JanSetu AI — Citizen & Policymaker Civic Governance Platform',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your Supabase JWT access token',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port, '0.0.0.0');
  logger.log(`JanSetu AI Backend running on port ${port} (0.0.0.0)`);
  logger.log(`API Base URL: http://localhost:${port}/api/v1`);
  logger.log(`Swagger Documentation: http://localhost:${port}/api/docs`);
  logger.log(`Health Check: http://localhost:${port}/api/v1/health`);
}

bootstrap();
