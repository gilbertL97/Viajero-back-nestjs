import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { CustomConfigService } from './service/config.service';
import { ConfigController } from './config.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntity } from './entities/config.entity';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './config.const';
import defaultConfig from './service/InitConfig';
import { UserService } from 'src/user/user.service';
import { LogginService } from 'src/loggin/loggin.service';
//import defaultConfig from './service/InitConfig';
@Module({
  controllers: [ConfigController],
  providers: [CustomConfigService],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([ConfigEntity], Configuration.POSTGRESCONNECT),
  ],
  exports: [CustomConfigService],
})
export class CustomConfigModule implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private configUser: UserService,
    private customConfigService: CustomConfigService,
    private logginService: LogginService,
  ) {}
  async onModuleInit() {
    defaultConfig(
      this.configService,
      this.configUser,
      this.customConfigService,
      this.logginService,
    );
  }
}
