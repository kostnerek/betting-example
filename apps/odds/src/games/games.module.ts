import { Module } from '@nestjs/common';
import { BetsModule } from 'apps/odds/src/bets/bets.module';
import { GamesController } from 'apps/odds/src/games/games.controller';
import { GamesDao } from 'apps/odds/src/games/games.dao';
import { GamesProcessor } from 'apps/odds/src/games/games.processor';
import { GamesSerializer } from 'apps/odds/src/games/games.serializer';
import { GamesService } from 'apps/odds/src/games/games.service';
import { TheOddsApiService } from 'apps/odds/src/games/the-odds-api.service';
import { SchedulerModule } from 'apps/odds/src/scheduler/scheduler.module';

@Module({
  imports: [SchedulerModule, BetsModule],
  controllers: [GamesController],
  providers: [
    GamesDao,
    GamesService,
    TheOddsApiService,
    GamesSerializer,
    GamesProcessor,
  ],
})
export class GamesModule {}
