import { Module, OnModuleInit } from '@nestjs/common';
import { CustomConfigService } from './service/config.service';
import { ConfigController } from './config.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntity } from './entities/config.entity';
import { ConfigService } from '@nestjs/config';
import defaultConfig from './service/InitConfig';
@Module({
  controllers: [ConfigController],
  providers: [CustomConfigService],
  imports: [UserModule, TypeOrmModule.forFeature([ConfigEntity])],
  exports: [CustomConfigService],
})
export class CustomConfigModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    defaultConfig(this.configService);
  }
}
