import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';

@Injectable()
export class MicroserviceConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getBetsMsHost(): string {
    return this.config.get<string>('BETS_MS_HOST') ?? 'localhost';
  }

  getBetsMsPort(): number {
    return this.config.get<number>('BETS_MS_PORT') ?? 6001;
  }

  getBetsMsUrl(): string {
    return `${this.getBetsMsHost()}:${this.getBetsMsPort()}`;
  }
}
