import { Module } from '@nestjs/common';
import { LogginService } from './loggin.service';
import { LogginController } from './loggin.controller';

@Module({
  controllers: [LogginController],
  providers: [LogginService],
})
export class LogginModule {}
