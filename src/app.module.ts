import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { typeOrmConfigAsync } from './config/config.typeorm';
import { AuthModule } from './auth/auth.module';
import { ContractorModule } from './contractor/contractor.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    ContractorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
