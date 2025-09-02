import { Module } from '@nestjs/common';
import { UsersModule } from 'apps/bets/src/users/users.module';
import { PrismaModule } from 'apps/bets/src/prisma/prisma.module';
import { AppConfigModule } from 'apps/bets/src/config/config.module';
import { BetsModule } from 'apps/bets/src/bets/bets.module';
import { LoggerModule } from '@app/common';

@Module({
  imports: [UsersModule, PrismaModule, AppConfigModule, BetsModule, LoggerModule.forRoot('bets')],
  controllers: [],
  providers: [],
})
export class AppModule {}
