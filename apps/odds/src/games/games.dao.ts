import { BetTeam, GameListRequest, GrpcErrors } from '@app/common';
import { Injectable } from '@nestjs/common';
import { GamesSerializer } from 'apps/odds/src/games/games.serializer';
import { PrismaService } from 'apps/odds/src/prisma/prisma.service';
import { Game, Odd, Prisma } from 'generated/prisma/odds';

@Injectable()
export class GamesDao {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamesSerializer: GamesSerializer,
  ) {}

  async getGameById(id: string): Promise<Game & { odds: Odd[] }> {
    const game = await this.prisma.game.findUnique({
      where: {
        id,
      },
      include: {
        odds: true,
      },
    });
    if (!game) {
      throw GrpcErrors.notFound('Game not found');
    }
    return game;
  }

  async getGames(args: GameListRequest): Promise<{
    games: Prisma.GameGetPayload<{ include: { odds: true } }>[];
    pagination: {
      currentPage: number;
      totalPages: number;
      pageSize: number;
      totalItems: number;
    };
  }> {
    if (!args.pagination) {
      throw GrpcErrors.invalidArgument('Pagination is required');
    }
    const queryArgs = this.gamesSerializer.findManySerialize(args);

    const totalItems = await this.prisma.game.count({
      where: queryArgs.where,
    });

    const games = (await this.prisma.game.findMany(
      queryArgs,
    )) as Prisma.GameGetPayload<{ include: { odds: true } }>[];

    const totalPages = Math.ceil(totalItems / args.pagination.pageSize);
    return {
      games,
      pagination: {
        currentPage: args.pagination.page,
        totalPages,
        pageSize: args.pagination.pageSize,
        totalItems,
      },
    };
  }

  async upsertMany(games: (Game & { odds: Omit<Odd, 'id'>[] })[]) {
    const upsertPromises = games.map(async (game) => {
      const upsertedGame = await this.prisma.game.upsert({
        where: {
          id: game.id,
        },
        create: {
          id: game.id,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          commenceTime: game.commenceTime,
          winner: game.winner,
        },
        update: {
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          commenceTime: game.commenceTime,
          winner: game.winner,
        },
      });

      if (game.odds && game.odds.length > 0) {
        const oddsUpsertPromises = game.odds.map((odd) =>
          this.prisma.odd.upsert({
            where: {
              gameId_team: {
                gameId: game.id,
                team: odd.team,
              },
            },
            create: {
              team: odd.team,
              odds: odd.odds,
              gameId: game.id,
            },
            update: {
              odds: odd.odds,
            },
          }),
        );

        await Promise.all(oddsUpsertPromises);
      }

      return upsertedGame;
    });

    return Promise.all(upsertPromises);
  }

  async getGamesByIds(ids: string[]) {
    return this.prisma.game.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        odds: true,
      },
    });
  }

  async updateGameResults(
    id: string,
    homeTeamScore: number,
    awayTeamScore: number,
    winner: BetTeam,
  ) {
    return this.prisma.game.update({
      where: {
        id,
      },
      data: {
        homeTeamScore,
        awayTeamScore,
        winner,
      },
    });
  }
}
