import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/config.const';
import { UserRole } from 'src/user/user.role';
import { UserService } from 'src/user/user.service';
import { CustomConfigService } from './config.service';
import { LogginService } from 'src/loggin/loggin.service';

async function userDefault(
  config: ConfigService,
  configUser: UserService,
  logginService: LogginService,
): Promise<void> {
  let systemUser = await configUser.findUserByName('system');

  if (!systemUser)
    systemUser = await configUser.createUser({
      name: 'system',
      email: 'system' + config.get<string>(Configuration.DEFAULT_ADMIN_email),
      password: config.get<string>(Configuration.DEFAULT_ADMIN_PASSW),
      role: UserRole.ADMIN,
      contractor: undefined,
    });

  await logginService.saveLog({
    message: 'Inicializando usuario sistema',
    context: 'InitConfig',
    level: 'info',
    createdAt: new Date().toISOString(),
    errorStack: '-',
    userAgent: '-',
    requestId: '-',
    ip: '-',
    method: '',
    url: '-',
    userId: systemUser.id,
  });

  await logginService.create({
    message: `Creando o buscando  usuario del sistema`,
    context: 'InitConfig',
    level: 'info',
    createdAt: new Date().toISOString(),
  });

  const defaultUser = await configUser.findUserByName(
    config.get<string>(Configuration.DEFAULT_ADMIN_USER),
  );
  if (!defaultUser)
    await configUser.createUser({
      name: config.get<string>(Configuration.DEFAULT_ADMIN_USER),
      email: config.get<string>(Configuration.DEFAULT_ADMIN_email),
      password: config.get<string>(Configuration.DEFAULT_ADMIN_PASSW),
      role: UserRole.ADMIN,
      contractor: undefined,
    });
  await logginService.saveLog({
    message: 'Inicializando usuario Aministrador por defecto',
    context: 'InitConfig',
    level: 'info',
    createdAt: new Date().toISOString(),
    errorStack: '-',
    userAgent: '-',
    requestId: '-',
    ip: '-',
    method: '',
    url: '-',
    userId: defaultUser.id,
  });
}
async function setDefaultFilePath(
  config: ConfigService,
  customConfigService: CustomConfigService,
) {
  await Promise.all([
    findOrCreateConfig(Configuration.FILES_PATH, config, customConfigService),
    findOrCreateConfig(Configuration.TEMP_FILE, config, customConfigService),
    findOrCreateConfig(
      Configuration.FIlES_PROCESSED_PATH,
      config,
      customConfigService,
    ),
    findOrCreateConfig(
      Configuration.FILES_LOGS_PATH,
      config,
      customConfigService,
    ),
    findOrCreateConfig(
      Configuration.FIlES_UNPROCESSED_PATH,
      config,
      customConfigService,
    ),
  ]);
}
async function findOrCreateConfig(
  key: string,
  config: ConfigService,
  customConfigService: CustomConfigService,
) {
  const existConfig = await customConfigService.findConfigByKEy(key);
  if (!existConfig) {
    await customConfigService.insertConfig({
      key: key,
      value: config.get<string>(key),
    });
  }
}
async function defaultConfig(
  config: ConfigService,
  configUser: UserService,
  customConfigService: CustomConfigService,
  logginService: LogginService,
) {
  await Promise.all([
    userDefault(config, configUser, logginService),
    setDefaultFilePath(config, customConfigService),
  ]);
}
export default defaultConfig;
