import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

<<<<<<< HEAD
import { UserModule } from './modules/user/user.module';
import { typeOrmConfigAsync } from './modules/config/config.typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ContractorModule } from './modules/contractor/contractor.module';
import { TravelerModule } from './modules/traveler/traveler.module';
import { CoverageModule } from './modules/coverage/coverage.module';
=======
import { UserModule } from './user/user.module';
import { typeOrmConfigAsync } from './config/config.typeorm';
import { AuthModule } from './auth/auth.module';
import { ContractorModule } from './contractor/contractor.module';
import { TravelerModule } from './traveler/traveler.module';
import { CoverageModule } from './coverage/coverage.module';
import { CountryModule } from './country/country.module';
>>>>>>> b938de94cb083b6b9b65e8073ebb37fd84214672

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
