import { Module } from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CoverageController } from './coverage.controller';
import { CoverageEntity } from './entities/coverage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorService } from 'src/contractor/contractor.service';

@Module({
  imports: [TypeOrmModule.forFeature([CoverageEntity])],
  controllers: [CoverageController],
  providers: [CoverageService],
  exports: [CoverageService],
})
export class CoverageModule {}
