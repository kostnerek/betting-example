import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { validate } from './env.variables';
import { ServerConfig } from './server.config';
import { MicroserviceConfig } from 'apps/bets/src/config/microservice.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
    }),
  ],
  providers: [ServerConfig, MicroserviceConfig],
  exports: [ServerConfig, MicroserviceConfig],
})
export class AppConfigModule {}
