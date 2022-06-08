import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { ContratorEntity } from './entity/contrator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContratorEntity])],
  controllers: [ContractorController],
  providers: [ContractorService],
  exports: [ContractorService],
})
export class ContractorModule {}
