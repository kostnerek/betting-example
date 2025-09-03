import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JobData } from 'apps/odds/src/scheduler/interfaces/job-data.interface';
import { BULL_MQ_QUEUE_NAME } from '@app/common';

interface ScheduledJobResult {
  jobId: string | undefined;
  scheduledFor: Date;
  delay: number;
  data: unknown;
}

@Injectable()
export class SchedulerService {
  constructor(
    @InjectQueue(BULL_MQ_QUEUE_NAME)
    private readonly processGamesQueue: Queue<JobData>,
  ) {}

  async scheduleJobAtDate(
    jobData: JobData,
    executionDate: Date,
    jobName = 'scheduled-job',
  ): Promise<ScheduledJobResult> {
    const delay = executionDate.getTime() - Date.now();

    if (delay <= 0) {
      throw new Error('Execution date must be in the future');
    }

    const job = await this.processGamesQueue.add(jobName, jobData, {
      delay,
      removeOnComplete: 10,
      removeOnFail: 5,
      jobId: jobData.gameId,
    });

    return {
      jobId: job.id,
      scheduledFor: executionDate,
      delay,
      data: jobData,
    };
  }

  async cancelScheduledJob(jobId: string): Promise<boolean> {
    const job = await this.processGamesQueue.getJob(jobId);

    if (!job) {
      return false;
    }

    await job.remove();
    return true;
  }

  async updateJobDate(jobId: string, executionDate: Date) {
    const job = await this.processGamesQueue.getJob(jobId);
    if (!job) {
      Logger.warn(`Job ${jobId} not found, creating new one`);
      return this.scheduleJobAtDate(
        { gameId: jobId, commenceTime: executionDate.toISOString() },
        executionDate,
      );
    }
    if (job.data.commenceTime !== executionDate.toISOString()) {
      await job.changeDelay(executionDate.getTime() - Date.now());
    }
    Logger.log(`Job ${jobId} data has not changed, skipping update`);

    return true;
  }

  async runJobNow(jobId: string) {
    const job = await this.processGamesQueue.getJob(jobId);
    if (!job) {
      return false;
    }
    Logger.log(`Found job ${jobId}, changing delay to none`);
    await job.remove();
    await this.processGamesQueue.add('scheduled-job', job.data, {
      removeOnComplete: 10,
      removeOnFail: 5,
      jobId,
    });
    return true;
  }

  async clearAllJobs() {
    const jobs = await this.processGamesQueue.getJobs();
    await Promise.all(jobs.map((job) => job.remove()));
  }
}
