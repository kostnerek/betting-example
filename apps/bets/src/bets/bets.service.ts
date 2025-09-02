import {
  BetPlaceRequest,
  BetsProcessByGameIdRequest,
  BetTeam,
  Bet as GrpcBet,
  Game,
  GrpcErrors,
  SuccessResponse,
} from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { BetsDao } from 'apps/bets/src/bets/bets.dao';
import { GamesService } from 'apps/bets/src/games/games.service';
import { UsersService } from 'apps/bets/src/users/users.service';
import Dinero from 'dinero.js';
import { Bet, Prisma, User } from 'generated/prisma/bets';

@Injectable()
export class BetsService {
  constructor(
    private readonly dao: BetsDao,
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
  ) {}

  private validateCommenceTime(gameCommenceTime: string): boolean {
    if (new Date() > new Date(gameCommenceTime)) {
      return false;
    }
    return true;
  }

  private validateUserBalance(userBalance: number, amount: number): boolean {
    const dineroUserBalance = Dinero({ amount: userBalance });
    const dineroAmount = Dinero({ amount });
    if (dineroUserBalance.lessThan(dineroAmount)) {
      return false;
    }
    return true;
  }

  private async validateIfBetAlreadyPlaced(
    userId: string,
    gameId: string,
  ): Promise<boolean> {
    const bet = await this.dao.findBetByUserIdAndGameId(userId, gameId);
    if (bet) {
      return false;
    }
    return true;
  }

  private async validate(user: User, game: Game, betAmount: number) {
    const isBetAlreadyPlaced = await this.validateIfBetAlreadyPlaced(
      user.id,
      game.id,
    );
    if (!isBetAlreadyPlaced) {
      throw GrpcErrors.invalidArgument('Bet already placed');
    }
    const isCommenceTimeValid = this.validateCommenceTime(game.commenceTime);
    if (!isCommenceTimeValid) {
      throw GrpcErrors.invalidArgument('Game commence time is in the past');
    }
    const isUserBalanceValid = this.validateUserBalance(
      user.balance,
      betAmount,
    );
    if (!isUserBalanceValid) {
      throw GrpcErrors.invalidArgument('User balance is too low');
    }
  }

  async betPlace(request: BetPlaceRequest, username: string): Promise<GrpcBet> {
    const game = await this.gamesService.gameById(request.gameId);
    if (!game) {
      throw GrpcErrors.notFound('Game');
    }
    const user = await this.usersService.userByUsername(username);
    /*
    - validate if user has not placed a bet on this game
    - validate if Date.now() is before game.commenceTime
    - validate if user has enough balance
    */
    await this.validate(user, game, request.amount);

    /*
      Below error is happening due to lack of serialization
      even though typescript proto types are suggesting that it should be string value from enum
      gRPC enums are always in int format - so there is this workaround

      I didn't find flag in ts_proto to disable this behavior
    */
    const bet = await this.dao.createBet(
      {
        gameId: request.gameId,
        amount: request.amount,
        team: request.team === 1 ? BetTeam.HOME : BetTeam.AWAY,
      },
      user.id,
    );
    Logger.log(
      `User ${user.id} placed bet on game ${game.id} for ${request.amount}, ${request.team}`,
    );
    const newBalance = Dinero({ amount: user.balance }).subtract(
      Dinero({ amount: request.amount }),
    );

    await this.usersService.userSetBalance(user.id, newBalance.getAmount());

    return {
      ...bet,
      game,
    };
  }

  async betsProcessByGameId(
    request: BetsProcessByGameIdRequest,
  ): Promise<SuccessResponse> {
    const game = await this.gamesService.gameById(request.gameId);
    if (!game) {
      throw GrpcErrors.notFound('Game');
    }
    Logger.log(
      `Processing bets for game ${game.id}, winner: ${request.winner}`,
    );

    const updateWonBets: Prisma.BetUpdateManyArgs = {
      where: {
        gameId: game.id,
        team: request.winner,
      },
      data: {
        won: true,
      },
    };
    const updateLostBets: Prisma.BetUpdateManyArgs = {
      where: {
        gameId: game.id,
        team: {
          not: request.winner,
        },
      },
      data: {
        won: false,
      },
    };
    const wonBetsCount = await this.dao.updateManyBets(updateWonBets);
    const lostBetsCount = await this.dao.updateManyBets(updateLostBets);
    Logger.log(
      `Processed ${wonBetsCount.count} won bets and ${lostBetsCount.count} lost bets for game ${game.id}`,
    );
    const wonBets = await this.dao.findBetsByGameIdAndWonStatus(game.id, true);
    await Promise.all(
      wonBets.map(async (bet: Bet) => {
        const betAmount = Dinero({ amount: bet.amount });

        const odds = game.odds.find((odd) => odd.team === bet.team);
        if (!odds) {
          throw GrpcErrors.internal('Odds not found');
        }
        const winnings = this.calculateWinnings(
          odds.odds,
          betAmount.getAmount(),
        );
        const user = await this.usersService.userById(bet.userId);
        const newBalance = Dinero({ amount: user.balance }).add(
          Dinero({ amount: winnings }),
        );
        return this.usersService.userSetBalance(
          bet.userId,
          newBalance.getAmount(),
        );
      }),
    );
    Logger.log(`Processed ${wonBets.length} won bets for game ${game.id}`);
    return { message: 'Bets processed successfully' };
  }

  private calculateWinnings(odds: number, betAmount: number) {
    let profit = Dinero();

    if (odds > 0) {
      // Positive odds (underdog)
      profit = Dinero({ amount: odds / 100 }).multiply(betAmount);
    } else {
      // Negative odds (favorite)
      profit = Dinero({ amount: 100 / Math.abs(odds) }).multiply(betAmount);
    }

    return Dinero({ amount: betAmount }).add(profit).getAmount();
  }
}
