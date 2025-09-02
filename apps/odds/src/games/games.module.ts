import { Module } from '@nestjs/common';
import { GamesController } from 'apps/odds/src/games/games.controller';
import { GamesDao } from 'apps/odds/src/games/games.dao';
import { GamesSerializer } from 'apps/odds/src/games/games.serializer';
import { GamesService } from 'apps/odds/src/games/games.service';
import { TheOddsApiService } from 'apps/odds/src/games/the-odds-api.service';
import { SchedulerModule } from 'apps/odds/src/scheduler/scheduler.module';

@Module({
  imports: [SchedulerModule],
  controllers: [GamesController],
  providers: [GamesDao, GamesService, TheOddsApiService, GamesSerializer],
})
export class GamesModule {}
