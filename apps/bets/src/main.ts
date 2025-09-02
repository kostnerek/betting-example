import { NestFactory } from '@nestjs/core';

import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'apps/bets/src/config/env.variables';
import { ServerConfig } from 'apps/bets/src/config/server.config';
import { AppModule } from 'apps/bets/src/app.module';
import { ReflectionService } from '@grpc/reflection';
import { protoPackageName, CustomLoggerService } from '@app/common';

async function bootstrap() {
  const config = new ConfigService<EnvironmentVariables>();
  const serverConfig = new ServerConfig(config);
  const logger = new CustomLoggerService('bets');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: `${serverConfig.getHost()}:${serverConfig.getPort()}`,
        package: protoPackageName,
        protoPath: [
          join(__dirname, '..', serverConfig.getMainProtoFile()),
          join(__dirname, '..', 'user.proto'),
        ],
        loader: {
          includeDirs: [join(__dirname, '../')],
        },
        onLoadPackageDefinition: (pkg, server) => {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );

  logger.log(
    `Bets service is running on: ${serverConfig.getHost()}:${serverConfig.getPort()}`,
    'Bootstrap',
  );
  await app.listen();
}
bootstrap().catch((err) =>
  new CustomLoggerService('bets').error('Failed to bootstrap Bets service', err, 'Bootstrap'),
);
