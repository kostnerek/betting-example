import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { validate } from './env.variables';
import { ServerConfig } from './server.config';
import { TheOddsApiConfig } from 'apps/odds/src/config/the-odds-api.config';
import { RedisConfig } from 'apps/odds/src/config/redis.config';
import { MicroserviceConfig } from 'apps/odds/src/config/microservice.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
    }),
  ],
  providers: [ServerConfig, TheOddsApiConfig, RedisConfig, MicroserviceConfig],
  exports: [ServerConfig, TheOddsApiConfig, RedisConfig, MicroserviceConfig],
})
export class AppConfigModule {}
