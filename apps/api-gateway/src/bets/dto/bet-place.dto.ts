import { BetTeam } from '@app/common';
import { IsEnum, IsString, Max, Min } from 'class-validator';

export class BetPlaceDto {
  @IsEnum(BetTeam)
  team: BetTeam;

  @Min(100)
  @Max(10000)
  amount: number; //value in cents

  @IsString()
  username: string;
}
