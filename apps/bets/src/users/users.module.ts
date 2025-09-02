import { Module } from '@nestjs/common';
import { GamesModule } from 'apps/bets/src/games/games.module';
import { UsersController } from 'apps/bets/src/users/users.controller';
import { UsersDao } from 'apps/bets/src/users/users.dao';
import { UsersService } from 'apps/bets/src/users/users.service';

@Module({
  imports: [GamesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersDao],
  exports: [UsersService],
})
export class UsersModule {}
