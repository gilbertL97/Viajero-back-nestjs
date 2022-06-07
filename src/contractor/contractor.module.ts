import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
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
