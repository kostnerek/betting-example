import { BetPlaceRequest, BetServiceClient, BetTeam } from '@app/common';

import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { BetPlaceDto } from 'apps/api-gateway/src/bets/dto/bet-place.dto';

@Injectable()
export class BetsService {
  private betGrpcService: BetServiceClient;
  constructor(@Inject('BET_SERVICE') private readonly betClient: ClientGrpc) {}

  onModuleInit() {
    this.betGrpcService =
      this.betClient.getService<BetServiceClient>('BetService');
  }

  createBet(body: BetPlaceDto, gameId: string) {
    const grpcBody: BetPlaceRequest = {
      ...body,
      gameId,
    };
    const metadata = new Metadata();
    console.log('betPlace', grpcBody);

    return this.betGrpcService.betPlace(grpcBody, metadata);
  }
}
