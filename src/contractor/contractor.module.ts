import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerModule } from 'src/traveler/traveler.module';
import { UserModule } from 'src/user/user.module';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { ContratorEntity } from './entity/contrator.entity';
import { ContractorRepository } from './repository/contractor.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractorRepository]),
    forwardRef(() => TravelerModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ContractorController],
  providers: [ContractorService],
  exports: [ContractorService],
})
export class ContractorModule {}
