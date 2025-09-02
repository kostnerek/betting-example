import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { protoPackageName } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'apps/odds/src/config/env.variables';
import { ServerConfig } from 'apps/odds/src/config/server.config';

async function bootstrap() {
  const config = new ConfigService<EnvironmentVariables>();
  const serverConfig = new ServerConfig(config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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

  Logger.log(
    `Odds service is running on: ${serverConfig.getHost()}:${serverConfig.getPort()}`,
    'Bootstrap',
  );
  await app.listen();
}
bootstrap().catch((err) =>
  Logger.error('Failed to bootstrap Odds service', err, 'Bootstrap'),
);
