import { plainToClass, Transform } from 'class-transformer';
import { IsInt, IsString, validateSync } from 'class-validator';

export enum Environment {
  Local = 'local',
  Dev = 'dev',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsString()
  ODDS_MS_HOST = 'localhost';

  @IsInt()
  @Transform(({ value }) => +value)
  ODDS_MS_PORT = 6000;

  @IsString()
  THE_ODDS_API_KEY: string;

  @IsString()
  THE_ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4/sports';

  @IsString()
  THE_ODDS_API_SPORT = 'basketball_nba';

  @IsString()
  THE_ODDS_API_MARKETS = 'h2h';

  @IsString()
  THE_ODDS_API_REGIONS = 'us';

  @IsString()
  MAIN_PROTO_FILE = 'game.proto';

  @IsString()
  REDIS_HOST = 'localhost';

  @IsInt()
  @Transform(({ value }) => +value)
  REDIS_PORT = 6379;

  @IsString()
  REDIS_PASSWORD = '';

  @IsInt()
  @Transform(({ value }) => +value)
  REDIS_DB = 0;

  @IsString()
  BETS_MS_HOST = 'localhost';

  @IsInt()
  @Transform(({ value }) => +value)
  BETS_MS_PORT = 6001;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
