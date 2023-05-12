import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerModule } from 'src/traveler/traveler.module';
import { UserModule } from 'src/user/user.module';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './service/contractor.service';
import { ContractorRepository } from './repository/contractor.repository';
import { ContractorExportService } from './service/contractorExport.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractorRepository]),
    forwardRef(() => TravelerModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ContractorController],
  providers: [ContractorService, ContractorExportService],
  exports: [ContractorService],
})
export class ContractorModule {}
