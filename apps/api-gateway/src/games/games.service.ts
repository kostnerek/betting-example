import { Inject, Injectable } from '@nestjs/common';
import { GamesListDto } from 'apps/api-gateway/src/games/dto/games-list.dto';
import { GameListRequest, GameServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class GamesService {
  private gamesGrpcService: GameServiceClient;

  constructor(
    @Inject('GAME_SERVICE') private readonly gameClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.gamesGrpcService =
      this.gameClient.getService<GameServiceClient>('GameService');
  }

  findAll(query: GamesListDto) {
    const metadata = new Metadata();
    const request: GameListRequest = {
      teamName: query.team,
      commenceTime: query.time,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
      },
    };
    return this.gamesGrpcService.gameListQuery(request, metadata);
  }

  refresh() {
    const metadata = new Metadata();
    return this.gamesGrpcService.gameRefresh({}, metadata);
  }

  generateResults(id: string) {
    const metadata = new Metadata();
    return this.gamesGrpcService.gameRunNow({ id }, metadata);
  }
}
