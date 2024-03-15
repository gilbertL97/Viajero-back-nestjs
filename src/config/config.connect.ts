import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Configuration } from './config.const';

export class ConfigTypeorm {
  constructor(private readonly configService: ConfigService) {}

  // eslint-disable-next-line prettier/prettier

  static getOrmPostgresConfig(
    configService: ConfigService,
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get(Configuration.POSTGRES_HOST),
      username: configService.get(Configuration.POSTGRES_USERNAME),
      password: configService.get(Configuration.POSTGRES_PASSWORD),
      database: configService.get(Configuration.POSTGRES_DATABASE),
      port: parseInt(configService.get(Configuration.POSTGRES_PORT)),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
      /* migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,*/
    };
  }
  static getOrmSqpliteConfig(
    configService: ConfigService,
  ): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: configService.get('SQLITE_DB'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}

export const typeOrmSQliteConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  name: 'SqliteConn',
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> =>
    ConfigTypeorm.getOrmSqpliteConfig(configService),
  inject: [ConfigService],
};
export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> =>
    ConfigTypeorm.getOrmPostgresConfig(configService),
  inject: [ConfigService],
};

export const getSecretKeyConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get<string>(Configuration.SECRET_KEY),
    };
  },
};
