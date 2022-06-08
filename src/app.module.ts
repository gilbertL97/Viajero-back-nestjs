import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/user/user.module';
import { typeOrmConfigAsync } from './modules/config/config.typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ContractorModule } from './modules/contractor/contractor.module';
import { TravelerModule } from './modules/traveler/traveler.module';
import { CoverageModule } from './modules/coverage/coverage.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    ContractorModule,
    TravelerModule,
    CoverageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
