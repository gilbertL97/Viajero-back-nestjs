import { Module } from '@nestjs/common';
import { TravelerService } from './traveler.service';
import { TravelerController } from './traveler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerEntity } from './entity/traveler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TravelerEntity])],
  controllers: [TravelerController],
  providers: [TravelerService],
})
export class TravelerModule {}
