import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SchedulerService } from 'apps/odds/src/scheduler/scheduler.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'process-games',
    }),
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
