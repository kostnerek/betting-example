import { Injectable } from '@nestjs/common';
import { TheOddsApiConfig } from 'apps/odds/src/config/the-odds-api.config';
import { TheOddsApiGameResponse } from 'apps/odds/src/games/interface/the-odds-api-response.interface';

@Injectable()
export class TheOddsApiService {
  constructor(private readonly theOddsApiConfig: TheOddsApiConfig) {}

  async getGames(): Promise<TheOddsApiGameResponse[] | null> {
    const apiKey = this.theOddsApiConfig.getApiKey();
    const baseUrl = this.theOddsApiConfig.getBaseUrl();
    const sport = this.theOddsApiConfig.getSport();
    const markets = this.theOddsApiConfig.getMarkets();
    const regions = this.theOddsApiConfig.getRegions();
    const oddsFormat = this.theOddsApiConfig.getOddsFormat();
    const url = `${baseUrl}/${sport}/odds?apiKey=${apiKey}&markets=${markets}&regions=${regions}&oddsFormat=${oddsFormat}`;
    const response = await fetch(url);
    const data = (await response.json()) as TheOddsApiGameResponse[];
    return data;
  }
}
