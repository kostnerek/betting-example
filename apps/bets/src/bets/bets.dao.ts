import { BetPlaceRequest } from '@app/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/bets/src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/bets';

@Injectable()
export class BetsDao {
  constructor(private readonly prismaService: PrismaService) {}

  createBet(args: Omit<BetPlaceRequest, 'username'>, userId: string) {
    return this.prismaService.bet.create({
      data: {
        userId,
        amount: args.amount,
        gameId: args.gameId,
        team: args.team,
      },
    });
  }

  findBetByUserIdAndGameId(userId: string, gameId: string) {
    return this.prismaService.bet.findFirst({
      where: {
        userId,
        gameId,
      },
    });
  }

  findBetsByGameId(gameId: string) {
    return this.prismaService.bet.findMany({
      where: {
        gameId,
      },
    });
  }

  findBetsByGameIdAndWonStatus(gameId: string, won: boolean) {
    return this.prismaService.bet.findMany({
      where: {
        gameId,
        won,
      },
    });
  }

  updateManyBets(bets: Prisma.BetUpdateManyArgs) {
    return this.prismaService.bet.updateMany(bets);
  }
}
