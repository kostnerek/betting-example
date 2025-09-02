import { BetTeam } from '@app/common';
import { IsEnum, Max, Min } from 'class-validator';

export class BetPlaceDto {
  @IsEnum(BetTeam)
  team: BetTeam;

  @Min(1)
  @Max(100)
  amount: number;

  username: string;
}
