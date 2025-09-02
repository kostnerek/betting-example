import { DynamicModule, Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';

@Module({})
export class LoggerModule {
  static forRoot(serviceName: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: CustomLoggerService,
          useValue: new CustomLoggerService(serviceName),
        },
      ],
      exports: [CustomLoggerService],
      global: true,
    };
  }
}
