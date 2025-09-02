import { Controller, Get, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesListDto } from 'apps/api-gateway/src/games/dto/games-list.dto';
import { firstValueFrom } from 'rxjs';
import { GameListResponse, SuccessResponse } from '@app/common';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(@Query() query: GamesListDto): Promise<GameListResponse> {
    return firstValueFrom(this.gamesService.findAll(query));
  }

  @Get('refresh')
  refresh(): Promise<SuccessResponse> {
    return firstValueFrom(this.gamesService.refresh());
  }

  @Get('generate-results/:gameId')
  generateResults(
    @Param() params: { gameId: string },
  ): Promise<SuccessResponse> {
    return firstValueFrom(this.gamesService.generateResults(params.gameId));
  }
}
