import { Module } from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CoverageController } from './coverage.controller';
import { CoverageEntity } from './entities/coverage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CoverageEntity])],
  controllers: [CoverageController],
  providers: [CoverageService],
})
export class CoverageModule {}
