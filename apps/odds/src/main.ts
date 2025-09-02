import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { protoPackageName, CustomLoggerService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'apps/odds/src/config/env.variables';
import { ServerConfig } from 'apps/odds/src/config/server.config';

async function bootstrap() {
  const config = new ConfigService<EnvironmentVariables>();
  const serverConfig = new ServerConfig(config);
  const logger = new CustomLoggerService('odds');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: `${serverConfig.getHost()}:${serverConfig.getPort()}`,
        package: protoPackageName,
        protoPath: join(__dirname, '../', serverConfig.getMainProtoFile()),
        loader: {
          includeDirs: [join(__dirname, '../')],
        },
      },
    },
  );

  logger.log(
    `Odds service is running on: ${serverConfig.getHost()}:${serverConfig.getPort()}`,
    'Bootstrap',
  );
  await app.listen();
}
bootstrap().catch((err) =>
  new CustomLoggerService('odds').error('Failed to bootstrap Odds service', err, 'Bootstrap'),
);
