import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'apps/odds/src/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
