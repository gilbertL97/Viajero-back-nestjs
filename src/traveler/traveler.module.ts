import { forwardRef, Module } from '@nestjs/common';
import { TravelerService } from './traveler.service';
import { TravelerController } from './traveler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoverageModule } from 'src/coverage/coverage.module';
import { ContractorModule } from 'src/contractor/contractor.module';
import { CountryModule } from 'src/country/country.module';
import { TravelerRepository } from './traveler.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelerRepository]),
    forwardRef(() => ContractorModule),
    forwardRef(() => CoverageModule),
    forwardRef(() => CountryModule),
  ],
  controllers: [TravelerController],
  providers: [TravelerService],
  exports: [TravelerService],
})
export class TravelerModule {}
