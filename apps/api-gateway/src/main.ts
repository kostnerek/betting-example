import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'apps/api-gateway/src/config/env.variables';
import { ServerConfig } from 'apps/api-gateway/src/config/server.config';
import { ValidationPipe } from '@nestjs/common';
import { GrpcExceptionFilter, NotFoundExceptionFilter, CustomLoggerService } from '@app/common';

async function bootstrap() {
  const config = new ConfigService<EnvironmentVariables>();
  const serverConfig = new ServerConfig(config);
  const logger = new CustomLoggerService('api-gateway');
  const app = await NestFactory.create(AppModule, { logger });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GrpcExceptionFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(serverConfig.getPort());
  logger.log(
    `Application is running on: localhost:${serverConfig.getPort()}`,
    'Bootstrap',
  );
}
bootstrap().catch((err) =>
  new CustomLoggerService('api-gateway').error('Failed to bootstrap', err, 'Bootstrap'),
);
