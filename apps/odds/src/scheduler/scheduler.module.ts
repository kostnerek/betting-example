import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SchedulerService } from 'apps/odds/src/scheduler/scheduler.service';
import { BULL_MQ_QUEUE_NAME } from '@app/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: BULL_MQ_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
