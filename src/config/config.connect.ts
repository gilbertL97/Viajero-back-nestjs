import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Configuration } from './config.const';
import { DataSource } from 'typeorm';

const config: ConfigService = new ConfigService();
const dbConfig = {
  type: 'postgres' as const,
  host: config.get<string>('DATABASE_HOST'),
  port: config.get<number>('DATABASE_PORT'),
  database: config.get<string>('DATABASE_NAME'),
  username: config.get<string>('DATABASE_USER'),
  password: config.get<string>('DATABASE_PASS'),
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  migrationsRun: true,
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  ssl: config.get('SSL_MODE', false),
  extra: {
    ssl:
      config.get('SSL_MODE', false) == 'true'
        ? {
            rejectUnauthorized: !config.get<boolean>('SSL_MODE', false),
          }
        : null,
  },
  cli: {
    migrationsDir: 'src/migrations',
  },
  logging: true,
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return dbConfig;
  },
};
export default new DataSource(dbConfig);
export class ConfigTypeorm {
  constructor(private readonly configService: ConfigService) {}

  // eslint-disable-next-line prettier/prettier

  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
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
  // } //make conection to redis
  // export const redisConfigAsync = async (configService: ConfigService) => {
  //   useFactory: async (configService: ConfigService) => {}
  //   const url = configService.get('REDIS_URL');
  //   const password = configService.get('REDIS_PASSWORD');
  //   const port = configService.get('REDIS_PORT');
  //   return store: await redisStore({
  //     // socket: {
  //     //   host: configService.get('REDIS_HOST'),
  //     //   port: configService.get('REDIS_PORT'),
  //     //   password: configService.get('REDIS_PASSWORD'),
  //     // },
  //     url: `redis://:${password}@${url}:${port}`,
  //   })}
  //   inject: [ConfigService];
  //   global: true;
}
export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ConfigTypeorm.getOrmConfig(configService),
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
