import {
  Game,
  GameByIdRequest,
  GameListByIdsRequest,
  GameListByIdsResponse,
  GameListRequest,
  GameListResponse,
  GameRunNowRequest,
  GameServiceController,
  GameServiceControllerMethods,
  SuccessResponse,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GamesService } from 'apps/odds/src/games/games.service';
import { SchedulerService } from 'apps/odds/src/scheduler/scheduler.service';
import { from } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Controller()
@GameServiceControllerMethods()
export class GamesController implements GameServiceController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly schedulerService: SchedulerService,
  ) {}

  @GrpcMethod()
  gameRunNow(request: GameRunNowRequest): Observable<SuccessResponse> {
    return from(
      this.schedulerService.runJobNow(request.id).then(() => ({
        message: 'Game run now successfully',
      })),
    );
  }

  @GrpcMethod()
  gameListQuery(request: GameListRequest): Observable<GameListResponse> {
    return from(this.gamesService.getGames(request));
  }

  @GrpcMethod()
  gameListByIds(
    request: GameListByIdsRequest,
  ): Observable<GameListByIdsResponse> {
    return from(this.gamesService.getGamesByIds(request.ids));
  }

  @GrpcMethod()
  gameRefresh(): Observable<SuccessResponse> {
    return from(this.gamesService.refreshGames());
  }

  @GrpcMethod()
  gameById(request: GameByIdRequest): Observable<Game> {
    return from(this.gamesService.getGameById(request.id));
  }
}
