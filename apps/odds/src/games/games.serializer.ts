import { BetTeam, GameListRequest, GrpcErrors } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/odds';
import { Game, Odd } from 'generated/prisma/odds';
import { TheOddsApiGameResponse } from 'apps/odds/src/games/interface/the-odds-api-response.interface';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class GamesSerializer {
  findManySerialize(args: GameListRequest): Prisma.GameFindManyArgs {
    if (!args.pagination) {
      throw GrpcErrors.invalidArgument('Pagination is required');
    }

    const where: Prisma.GameWhereInput = {};

    // Filter by team name if provided
    if (args.teamName) {
      where.OR = [
        {
          homeTeam: {
            contains: args.teamName,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          awayTeam: {
            contains: args.teamName,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ];
    }

    // Filter by commence time if provided
    if (args.commenceTime) {
      const commenceTime = new Date(args.commenceTime);
      where.commenceTime = {
        gte: startOfDay(commenceTime),
        lte: endOfDay(commenceTime),
      };
    }

    return {
      where,
      take: args.pagination.pageSize,
      skip: (args.pagination.page - 1) * args.pagination.pageSize,
      include: {
        odds: true,
      },
    };
  }

  serializeTheOddsApiGameToPrisma(
    game: TheOddsApiGameResponse,
  ): Game & { odds: Omit<Odd, 'id'>[] } {
    const determineTeam = (team: string): BetTeam => {
      if (team === game.home_team) {
        return BetTeam.HOME;
      }
      return BetTeam.AWAY;
    };

    const selectedMarket = game.bookmakers[0].markets[0];

    return {
      ...game,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      commenceTime: new Date(game.commence_time),
      winner: null,
      odds: [
        {
          team: determineTeam(selectedMarket.outcomes[0].name),
          odds: selectedMarket.outcomes[0].price,
          gameId: game.id,
        },
        {
          team: determineTeam(selectedMarket.outcomes[1].name),
          odds: selectedMarket.outcomes[1].price,
          gameId: game.id,
        },
      ],
    };
  }
}
