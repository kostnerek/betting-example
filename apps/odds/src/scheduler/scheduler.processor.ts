import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('process-games')
export class SchedulerProcessor extends WorkerHost {
  async process(job: Job<{ gameId: string }, any, string>) {
    await this.processScheduledJob(job.data);

    return true;
  }

  private async processScheduledJob(jobData: { gameId: string }) {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('Processing game with ID:', jobData.gameId);
        resolve(true);
      }, 1000);
    });
    console.log('Processing game with ID:', jobData.gameId);
    // TODO: Add your actual job processing logic here
  }
}
