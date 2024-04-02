import { CustomConfigModule } from './../config/config.module';
import { Module, forwardRef } from '@nestjs/common';
import { FileService } from './service/file.service';
import { FileController } from './file.controller';
import { FileEntity } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AutoImportFileService } from './service/automaticImportFile';
import { ContractorModule } from 'src/contractor/contractor.module';
import { TravelerModule } from 'src/traveler/traveler.module';
import { ExportToTxt } from './service/exportToTxt';
import { CountryModule } from 'src/country/country.module';
import { CoverageModule } from 'src/coverage/coverage.module';
import { Configuration } from 'src/config/config.const';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([FileEntity], Configuration.POSTGRESCONNECT),
    forwardRef(() => TravelerModule),
    forwardRef(() => UserModule),
    forwardRef(() => ContractorModule),
    forwardRef(() => CountryModule),
    forwardRef(() => CoverageModule),
    CustomConfigModule,
  ],
  controllers: [FileController],
  providers: [FileService, AutoImportFileService, ExportToTxt],
  exports: [FileService],
})
export class FileModule {}
