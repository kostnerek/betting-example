import { protoPackageName } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceConfig } from 'apps/bets/src/config/microservice.config';
import { GamesService } from 'apps/bets/src/games/games.service';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
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
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
