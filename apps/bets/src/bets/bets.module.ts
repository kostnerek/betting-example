import { Module } from '@nestjs/common';
import { BetsController } from 'apps/bets/src/bets/bets.controller';
import { BetsDao } from 'apps/bets/src/bets/bets.dao';
import { BetsService } from 'apps/bets/src/bets/bets.service';
import { GamesModule } from 'apps/bets/src/games/games.module';
import { UsersModule } from 'apps/bets/src/users/users.module';

@Module({
  imports: [GamesModule, UsersModule],
  controllers: [BetsController],
  providers: [BetsService, BetsDao],
})
export class BetsModule {}
