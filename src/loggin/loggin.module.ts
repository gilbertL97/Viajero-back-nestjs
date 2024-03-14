import { Module } from '@nestjs/common';
import { LogginService } from './loggin.service';
import { LogginController } from './loggin.controller';
import { AsyncLocalStorage } from 'node:async_hooks';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/loggin.entity';
@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [LogginController],
  providers: [
    LogginService,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: [AsyncLocalStorage, LogginService],
})
export class LogginModule {}
