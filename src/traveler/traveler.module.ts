import { forwardRef, Module } from '@nestjs/common';
import { TravelerService } from './service/traveler.service';
import { TravelerController } from './traveler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoverageModule } from 'src/coverage/coverage.module';
import { ContractorModule } from 'src/contractor/contractor.module';
import { CountryModule } from 'src/country/country.module';
import { TravelerRepository } from './traveler.repository';
import { UserModule } from 'src/user/user.module';
import { TravelerDocService } from './service/traveler-doc.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelerRepository]),
    forwardRef(() => ContractorModule),
    forwardRef(() => CoverageModule),
    forwardRef(() => CountryModule),
    forwardRef(() => UserModule),
  ],
  controllers: [TravelerController],
  providers: [TravelerService, TravelerDocService],
  exports: [TravelerService],
})
export class TravelerModule {}
