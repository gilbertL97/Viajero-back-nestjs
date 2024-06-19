import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerModule } from 'src/traveler/traveler.module';
import { UserModule } from 'src/user/user.module';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './service/contractor.service';
import { ContractorRepository } from './repository/contractor.repository';
import { ContractorExportService } from './service/contractorExport.service';
import { ContratorEntity } from './entity/contrator.entity';
import { Configuration } from 'src/config/config.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContratorEntity], Configuration.POSTGRESCONNECT),
    forwardRef(() => TravelerModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ContractorController],
  providers: [ContractorService, ContractorExportService, ContractorRepository],
  exports: [ContractorService],
})
export class ContractorModule {}
