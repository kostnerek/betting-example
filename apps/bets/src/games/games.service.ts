import { Game, GameListByIdsResponse, GameServiceClient } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GamesService {
  private gameService: GameServiceClient;
  constructor(
    @Inject('GAME_SERVICE') private readonly gameClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.gameService =
      this.gameClient.getService<GameServiceClient>('GameService');
  }

  async gameById(id: string): Promise<Game> {
    return firstValueFrom(this.gameService.gameById({ id }, new Metadata()));
  }

  async gameListByIds(ids: string[]): Promise<GameListByIdsResponse> {
    return firstValueFrom(
      this.gameService.gameListByIds({ ids }, new Metadata()),
    );
  }
}
