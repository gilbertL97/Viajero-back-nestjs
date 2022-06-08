import { Module } from '@nestjs/common';
import { TravelerService } from './sevices/traveler.service';
import { TravelerController } from './controller/traveler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerEntity } from './entity/traveler.entity';
import { CountryEntity } from './entity/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TravelerEntity, CountryEntity])],
  controllers: [TravelerController],
  providers: [TravelerService],
})
export class TravelerModule {}
