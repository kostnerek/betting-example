import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SchedulerService } from 'apps/odds/src/scheduler/scheduler.service';
import { SchedulerProcessor } from 'apps/odds/src/scheduler/scheduler.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'process-games',
    }),
  ],
  providers: [SchedulerService, SchedulerProcessor],
  exports: [SchedulerService],
})
export class SchedulerModule {}
