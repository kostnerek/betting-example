import { BetTeam } from '@app/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BetsService } from 'apps/odds/src/bets/bets.service';
import { GamesService } from 'apps/odds/src/games/games.service';

import { Job } from 'bullmq';

@Processor('process-games')
export class GamesProcessor extends WorkerHost {
  constructor(
    private readonly betsService: BetsService,
    private readonly gamesService: GamesService,
  ) {
    super();
  }
  async process(job: Job<{ gameId: string }, any, string>) {
    await this.processScheduledJob(job.data);
  }

  private async processScheduledJob(jobData: { gameId: string }) {
    console.log('Processing game with ID:', jobData.gameId);
    const game = await this.gamesService.generateGameResults(jobData.gameId);
    await this.betsService.betsProcessByGameId(
      jobData.gameId,
      game.winner as BetTeam,
    );
  }
}
