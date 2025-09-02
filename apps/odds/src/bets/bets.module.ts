import { protoPackageName } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BetsService } from 'apps/odds/src/bets/bets.service';
import { MicroserviceConfig } from 'apps/odds/src/config/microservice.config';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
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
      ],
    }),
  ],
  providers: [BetsService],
  exports: [BetsService],
})
export class BetsModule {}
