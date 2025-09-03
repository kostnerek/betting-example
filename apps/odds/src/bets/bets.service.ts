import { BetServiceClient, BetTeam } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BetsService {
  private betService: BetServiceClient;
  constructor(@Inject('BET_SERVICE') private readonly betClient: ClientGrpc) {}

  onModuleInit() {
    this.betService = this.betClient.getService<BetServiceClient>('BetService');
  }
  async betsProcessByGameId(gameId: string, winner: BetTeam) {
    Logger.log(`Processing game with ID: ${gameId}, winner: ${winner}`);
    return await firstValueFrom(
      this.betService.betsProcessByGameId({ gameId, winner }, new Metadata()),
    );
  }
}
