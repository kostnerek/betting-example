import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';

@Injectable()
export class TheOddsApiConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getApiKey(): string {
    return this.config.get<string>('THE_ODDS_API_KEY') ?? '';
  }

  getBaseUrl(): string {
    return (
      this.config.get<string>('THE_ODDS_API_BASE_URL') ??
      'https://api.the-odds-api.com/v4/sports'
    );
  }

  getSport(): string {
    return this.config.get<string>('THE_ODDS_API_SPORT') ?? 'basketball_nba';
  }

  getMarkets(): string {
    return this.config.get<string>('THE_ODDS_API_MARKETS') ?? 'h2h';
  }

  getRegions(): string {
    return this.config.get<string>('THE_ODDS_API_REGIONS') ?? 'us';
  }

  getOddsFormat(): string {
    return 'american';
  }
}
