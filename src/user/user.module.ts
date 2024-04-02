import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorModule } from 'src/contractor/contractor.module';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Configuration } from 'src/config/config.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], Configuration.POSTGRESCONNECT),
    forwardRef(() => ContractorModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
