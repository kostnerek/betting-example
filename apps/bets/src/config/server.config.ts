import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';

@Injectable()
export class ServerConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getPort(): number {
    return this.config.get<number>('BETS_MS_PORT') ?? 6000;
  }

  getHost(): string {
    return this.config.get<string>('BETS_MS_HOST') ?? 'localhost';
  }

  getMainProtoFile(): string {
    return this.config.get<string>('MAIN_PROTO_FILE') ?? 'bet.proto';
  }
}
