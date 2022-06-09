import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { typeOrmConfigAsync } from './config/config.typeorm';
import { AuthModule } from './auth/auth.module';
import { ContractorModule } from './contractor/contractor.module';
import { TravelerModule } from './traveler/traveler.module';
import { CoverageModule } from './coverage/coverage.module';
import { CountryModule } from './country/country.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    ContractorModule,
    TravelerModule,
    CoverageModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
