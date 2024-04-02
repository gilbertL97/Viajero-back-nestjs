import { forwardRef, Module } from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CoverageController } from './coverage.controller';
import { CoverageEntity } from './entities/coverage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerModule } from 'src/traveler/traveler.module';
import { Configuration } from 'src/config/config.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoverageEntity], Configuration.POSTGRESCONNECT),
    forwardRef(() => TravelerModule),
  ],
  controllers: [CoverageController],
  providers: [CoverageService],
  exports: [CoverageService],
})
export class CoverageModule {}
