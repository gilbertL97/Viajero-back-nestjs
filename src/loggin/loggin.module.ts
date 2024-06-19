import { Global, Module } from '@nestjs/common';
import { LogginService } from './loggin.service';
import { LogginController } from './loggin.controller';
import { AsyncLocalStorage } from 'node:async_hooks';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/loggin.entity';
import { Configuration } from 'src/config/config.const';
import { LogginRepository } from './repository/loggin.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LogEntity], Configuration.SQLITECONNECT)],
  controllers: [LogginController],
  providers: [
    LogginService,
    LogginRepository,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: [AsyncLocalStorage, LogginService],
})
export class LogginModule {}
