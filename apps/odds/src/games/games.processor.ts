import { BetTeam, BULL_MQ_QUEUE_NAME } from '@app/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BetsService } from 'apps/odds/src/bets/bets.service';
import { GamesService } from 'apps/odds/src/games/games.service';
import { JobData } from 'apps/odds/src/scheduler/interfaces/job-data.interface';

import { Job } from 'bullmq';

@Processor(BULL_MQ_QUEUE_NAME)
export class GamesProcessor extends WorkerHost {
  constructor(
    private readonly betsService: BetsService,
    private readonly gamesService: GamesService,
  ) {
    super();
  }
  async process(job: Job<JobData, boolean, string>) {
    const jobData = job.data;

    const game = await this.gamesService.generateGameResults(jobData.gameId);
    const response = await this.betsService.betsProcessByGameId(
      jobData.gameId,
      game.winner as BetTeam,
    );
    if (response.message) {
      return true;
    }
    return false;
  }
}
