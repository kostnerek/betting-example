import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';

@Injectable()
export class RedisConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getHost(): string {
    return this.config.get<string>('REDIS_HOST') ?? 'localhost';
  }

  getPort(): number {
    return this.config.get<number>('REDIS_PORT') ?? 6379;
  }

  getConnectionOptions() {
    return {
      host: this.getHost(),
      port: this.getPort(),
    };
  }
}
