import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('process-games')
export class SchedulerProcessor extends WorkerHost {
  async process(job: Job<{ gameId: string }, any, string>) {
    console.log('Processing scheduled job:', {
      jobId: job.id,
      jobName: job.name,
      jobData: job.data,
      processedAt: new Date().toISOString(),
    });

    // Your scheduled job logic goes here
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
    // Add your actual job processing logic here
  }
}
