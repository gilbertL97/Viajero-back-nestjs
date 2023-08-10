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
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TravelerModule,
    ContractorModule,
    CoverageModule,
    CountryModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ThrottlerModule.forRoot({
      ttl: 60, // time to live in seconds
      limit: 25, // number of requests allowed within the TTL 25 request por minuto
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
