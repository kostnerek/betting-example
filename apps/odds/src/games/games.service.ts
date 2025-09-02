import {
  BetTeam,
  Game,
  GameListByIdsResponse,
  GameListRequest,
  GameListResponse,
  GrpcErrors,
} from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { GamesDao } from 'apps/odds/src/games/games.dao';
import { GamesSerializer } from 'apps/odds/src/games/games.serializer';
import { TheOddsApiGameResponse } from 'apps/odds/src/games/interface/the-odds-api-response.interface';
import { TheOddsApiService } from 'apps/odds/src/games/the-odds-api.service';
import { SchedulerService } from 'apps/odds/src/scheduler/scheduler.service';

@Injectable()
export class GamesService {
  constructor(
    private readonly gamesDao: GamesDao,
    private readonly theOddsApiService: TheOddsApiService,
    private readonly gamesSerializer: GamesSerializer,
    private readonly schedulerService: SchedulerService,
  ) {}

  async generateGameResults(id: string) {
    Logger.log(`Generating results for game ${id}`);
    const game = await this.gamesDao.getGameById(id);
    if (!game) {
      Logger.error(`Game ${id} not found`);
      throw GrpcErrors.notFound('Game not found');
    }
    const homeTeamScore = Math.floor(Math.random() * 10);
    const awayTeamScore = Math.floor(Math.random() * 10);
    const winner = homeTeamScore > awayTeamScore ? BetTeam.HOME : BetTeam.AWAY;
    Logger.log(
      `Game ${id} results generated: ${winner}, score: ${homeTeamScore} - ${awayTeamScore}`,
    );
    await this.gamesDao.updateGameResults(
      id,
      homeTeamScore,
      awayTeamScore,
      winner,
    );
    return { message: 'Game results generated successfully' };
  }

  async getGameById(id: string): Promise<Game> {
    const game = await this.gamesDao.getGameById(id);
    if (!game) {
      throw GrpcErrors.notFound('Game not found');
    }
    return {
      ...game,
      commenceTime: game.commenceTime.toISOString(),
      winner: game.winner ?? undefined,
    };
  }

  async getGames(args: GameListRequest): Promise<GameListResponse> {
    const data = await this.gamesDao.getGames(args);

    const games = data.games.map((game) => {
      return {
        ...game,
        commenceTime: game.commenceTime.toISOString(),
        winner: game.winner ?? undefined,
      };
    });

    const response: GameListResponse = {
      games,
      pagination: data.pagination,
    };
    return response;
  }

  async refreshGames() {
    Logger.log('Refreshing games...');
    const games = await this.theOddsApiService.getGames();
    if (!games) {
      throw GrpcErrors.internal('The odds api response is empty');
    }
    Logger.log(`Games fetched: ${games.length}`);

    const gamesParsed = games.map((game: TheOddsApiGameResponse) => {
      return this.gamesSerializer.serializeTheOddsApiGameToPrisma(game);
    });

    const gamesFromDb = await this.gamesDao.upsertMany(gamesParsed);
    await Promise.all(
      gamesFromDb.map((game) => {
        if (game.createdAt === game.updatedAt) {
          Logger.log(
            `Scheduling job for game ${game.id}, commence time: ${game.commenceTime.toISOString()}`,
          );
          return this.schedulerService.scheduleJobAtDate(
            { gameId: game.id, commenceTime: game.commenceTime.toISOString() },
            new Date(game.commenceTime),
          );
        } else {
          Logger.log(
            `Updating job for game ${game.id}, commence time: ${game.commenceTime.toISOString()}`,
          );
          return this.schedulerService.updateJobDate(
            game.id,
            new Date(game.commenceTime),
          );
        }
      }),
    );

    Logger.log('Games refreshed successfully');
    return { message: 'Games refreshed successfully' };
  }

  async getGamesByIds(ids: string[]) {
    const games = await this.gamesDao.getGamesByIds(ids);
    if (!games) {
      return { games: [] };
    }
    const gamesSerialized = games.map((game) => {
      return {
        ...game,
        commenceTime: game.commenceTime.toISOString(),
        winner: game.winner ?? undefined,
      };
    });
    const response: GameListByIdsResponse = {
      games: gamesSerialized,
    };
    return response;
  }
}
