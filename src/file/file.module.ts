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

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([FileEntity]),
    forwardRef(() => TravelerModule),
    forwardRef(() => UserModule),
    forwardRef(() => ContractorModule),
  ],
  controllers: [FileController],
  providers: [FileService, AutoImportFileService, ExportToTxt],
  exports: [FileService],
})
export class FileModule {}
