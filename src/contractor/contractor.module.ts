import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelerModule } from 'src/traveler/traveler.module';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { ContratorEntity } from './entity/contrator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContratorEntity]),
    forwardRef(() => TravelerModule),
  ],
  controllers: [ContractorController],
  providers: [ContractorService],
  exports: [ContractorService],
})
export class ContractorModule {}
