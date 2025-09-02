import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'apps/api-gateway/src/config/env.variables';
import { ServerConfig } from 'apps/api-gateway/src/config/server.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GrpcExceptionFilter, NotFoundExceptionFilter } from '@app/common';

async function bootstrap() {
  const config = new ConfigService<EnvironmentVariables>();
  const serverConfig = new ServerConfig(config);
  const app = await NestFactory.create(AppModule);

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
  Logger.log(
    `Application is running on: localhost:${serverConfig.getPort()}`,
    'Bootstrap',
  );
}
bootstrap().catch((err) =>
  Logger.error('Failed to bootstrap', err, 'Bootstrap'),
);
