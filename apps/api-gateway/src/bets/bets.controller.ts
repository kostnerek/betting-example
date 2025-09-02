import { Body, Controller, Param, Post } from '@nestjs/common';
import { BetsService } from './bets.service';
import { Bet } from '@app/common';
import { BetPlaceDto } from 'apps/api-gateway/src/bets/dto/bet-place.dto';
import { firstValueFrom } from 'rxjs';

@Controller('bet')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post('place/:gameId')
  createBet(
    @Param() params: { gameId: string },
    @Body() body: BetPlaceDto,
  ): Promise<Bet> {
    return firstValueFrom(this.betsService.createBet(body, params.gameId));
  }
}
