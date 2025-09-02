import { protoPackageName } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BetsModule } from 'apps/api-gateway/src/bets/bets.module';
import { AppConfigModule } from 'apps/api-gateway/src/config/config.module';
import { MicroserviceConfig } from 'apps/api-gateway/src/config/microservice.config';
import { GamesModule } from 'apps/api-gateway/src/games/games.module';
import { UsersModule } from 'apps/api-gateway/src/users/users.module';
import { join } from 'path';

const commonModules = [BetsModule, GamesModule, UsersModule];
@Module({
  imports: [
    ...commonModules,
    AppConfigModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          inject: [MicroserviceConfig],
          name: 'USER_SERVICE',
          useFactory: (config: MicroserviceConfig) => {
            return {
              transport: Transport.GRPC,
              options: {
                url: config.getBetsMsUrl(),
                package: protoPackageName,
                protoPath: join(__dirname, '..', 'user.proto'),
              },
            };
          },
        },
        {
          inject: [MicroserviceConfig],
          name: 'BET_SERVICE',
          useFactory: (config: MicroserviceConfig) => {
            return {
              transport: Transport.GRPC,
              options: {
                url: config.getBetsMsUrl(),
                package: protoPackageName,
                protoPath: join(__dirname, '..', 'bet.proto'),
              },
            };
          },
        },
        {
          inject: [MicroserviceConfig],
          name: 'GAME_SERVICE',
          useFactory: (config: MicroserviceConfig) => {
            return {
              transport: Transport.GRPC,
              options: {
                url: config.getOddsMsUrl(),
                package: protoPackageName,
                protoPath: join(__dirname, '..', 'game.proto'),
              },
            };
          },
        },
      ],
    }),
  ],
  providers: [],
})
export class AppModule {}
