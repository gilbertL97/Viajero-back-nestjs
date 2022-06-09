import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD:src/modules/contractor/contractor.module.ts
<<<<<<< HEAD:src/modules/contractor/contractor.module.ts
import { ContractorController } from './controller/contractor.controller';
import { ContractorService } from './sevices/contractor.service';
=======
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
>>>>>>> b938de94cb083b6b9b65e8073ebb37fd84214672:src/contractor/contractor.module.ts
=======
import { UserModule } from 'src/user/user.module';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
>>>>>>> parent of f07b925 (Refactorizando la estructura de carpetas):src/contractor/contractor.module.ts
import { ContratorEntity } from './entity/contrator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContratorEntity])],
  controllers: [ContractorController],
  providers: [ContractorService],
  exports: [ContractorService],
})
export class ContractorModule {}
