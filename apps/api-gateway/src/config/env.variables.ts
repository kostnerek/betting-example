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
  HOST = 'localhost';

  @IsInt()
  @Transform(({ value }) => +value)
  PORT = 3000;

  @IsString()
  ODDS_MS_HOST = 'localhost';

  @IsInt()
  @Transform(({ value }) => +value)
  ODDS_MS_PORT = 6000;

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
