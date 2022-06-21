import { Module } from '@nestjs/common';
import { TravelerService } from './traveler.service';
import { TravelerController } from './traveler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerEntity } from './entity/traveler.entity';
import { CoverageModule } from 'src/coverage/coverage.module';
import { ContractorModule } from 'src/contractor/contractor.module';
import { CountryModule } from 'src/country/country.module';
import { TravelerRepository } from './traveler.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelerEntity]),
    ContractorModule,
    CoverageModule,
    CountryModule,
  ],
  controllers: [TravelerController],
  providers: [TravelerService, TravelerRepository],
})
export class TravelerModule {}
