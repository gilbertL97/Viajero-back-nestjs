import { forwardRef, Module } from '@nestjs/common';
import { TravelerService } from './service/traveler.service';
import { TravelerController } from './traveler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoverageModule } from 'src/coverage/coverage.module';
import { ContractorModule } from 'src/contractor/contractor.module';
import { CountryModule } from 'src/country/country.module';
import { TravelerRepository } from './repository/traveler.repository';
import { UserModule } from 'src/user/user.module';
import { TravelerPdfService } from './service/traveler-pdf.service';
import { TravelerUploadFilesService } from './service/traveler.upload-files.service';
import { FileModule } from 'src/file/file.module';
import { TravelerEntity } from './entity/traveler.entity';
import { Configuration } from 'src/config/config.const';
import { CustomConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelerEntity], Configuration.POSTGRESCONNECT),
    forwardRef(() => ContractorModule),
    forwardRef(() => CoverageModule),
    forwardRef(() => CountryModule),
    forwardRef(() => UserModule),
    FileModule,
    CustomConfigModule,
  ],
  controllers: [TravelerController],
  providers: [
    TravelerService,
    TravelerPdfService,
    TravelerUploadFilesService,
    TravelerRepository,
  ],
  exports: [TravelerService, TravelerUploadFilesService],
})
export class TravelerModule {}
