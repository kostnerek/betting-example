import {
  Bet,
  BetPlaceRequest,
  BetServiceController,
  BetServiceControllerMethods,
  BetsProcessByGameIdRequest,
  SuccessResponse,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BetsService } from 'apps/bets/src/bets/bets.service';

import { Observable, from } from 'rxjs';

@Controller()
@BetServiceControllerMethods()
export class BetsController implements BetServiceController {
  constructor(private readonly betsService: BetsService) {}

  @GrpcMethod()
  betPlace(request: BetPlaceRequest): Observable<Bet> {
    return from(this.betsService.betPlace(request, request.username));
  }

  @GrpcMethod()
  betsProcessByGameId(
    request: BetsProcessByGameIdRequest,
  ): Observable<SuccessResponse> {
    return from(this.betsService.betsProcessByGameId(request));
  }
}
