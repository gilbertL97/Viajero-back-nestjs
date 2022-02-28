import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Configuration } from './config.const';

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
      logging: true,
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ConfigTypeorm.getOrmConfig(configService),
  inject: [ConfigService],
};
