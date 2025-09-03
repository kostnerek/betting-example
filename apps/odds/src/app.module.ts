import { Module } from '@nestjs/common';
import { AppConfigModule } from 'apps/odds/src/config/config.module';
import { PrismaModule } from 'apps/odds/src/prisma/prisma.module';
import { GamesModule } from 'apps/odds/src/games/games.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisConfig } from 'apps/odds/src/config/redis.config';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    GamesModule,
    LoggerModule.forRoot('odds'),
    BullModule.forRootAsync({
      inject: [RedisConfig],
      useFactory: (config: RedisConfig) => {
        return {
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true,
          },
          connection: config.getConnectionOptions(),
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
