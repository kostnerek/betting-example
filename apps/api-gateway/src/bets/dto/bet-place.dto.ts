import { BetTeam } from '@app/common';
import { IsEnum, IsString, Max, Min } from 'class-validator';

export class BetPlaceDto {
  @IsEnum(BetTeam)
  team: BetTeam;

  @Min(1)
  @Max(100)
  amount: number;

  @IsString()
  username: string;
}
