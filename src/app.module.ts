import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import {
  typeOrmConfigAsync,
  typeOrmSQliteConfigAsync,
} from './config/config.connect';
import { AuthModule } from './auth/auth.module';
import { ContractorModule } from './contractor/contractor.module';
import { TravelerModule } from './traveler/traveler.module';
import { CoverageModule } from './coverage/coverage.module';
import { CountryModule } from './country/country.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomConfigModule } from './config/config.module';
import { storeData } from './common/store/middleware/store.middleware';
import { LogginModule } from './loggin/loggin.module';
import { RequestLogginMiddleware } from './loggin/middleware/requestLogginMiddleware';

import { LogginResponseInterceptor } from './loggin/interceptor/responseLoggin.interceptor';
import { HttpExceptionFilterLog } from './loggin/filter/ExceptionFilterLog';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TypeOrmModule.forRootAsync(typeOrmSQliteConfigAsync),
    TravelerModule,
    ContractorModule,
    CoverageModule,
    CountryModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 6000, // time to live in seconds
        limit: 25, // number of requests allowed within the TTL 25 request por minuto
      },
    ]),
    CustomConfigModule,
    LogginModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogginResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilterLog,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(storeData).forRoutes('*');
    consumer
      .apply(RequestLogginMiddleware)
      .exclude('loggin') // Pasar el string como parámetro
      .forRoutes('*');
  }
}
