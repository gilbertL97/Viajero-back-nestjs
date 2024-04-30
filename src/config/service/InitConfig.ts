import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/config.const';
import { UserRole } from 'src/user/user.role';
import { UserService } from 'src/user/user.service';
import { CustomConfigService } from './config.service';

async function userDefault(
  config: ConfigService,
  configUser: UserService,
): Promise<void> {
  const systemUser = await configUser.findUserByName('system');
  if (!systemUser)
    await configUser.createUser({
      name: 'system',
      email: 'system' + config.get<string>(Configuration.DEFAULT_ADMIN_email),
      password: config.get<string>(Configuration.DEFAULT_ADMIN_PASSW),
      role: UserRole.ADMIN,
      contractor: undefined,
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
  // const userRepository = getRepository<UserEntity>(UserEntity);
  // const systemUser = await userRepository
  //   .createQueryBuilder()
  //   .where('name = :name', {
  //     name: 'system',
  //   })
  //   .getOne();
  // if (!systemUser) {
  //   const sytem = userRepository.create({
  //     name: 'system',
  //     email: 'system' + config.get<string>(Configuration.DEFAULT_ADMIN_email),
  //     password: config.get<string>(Configuration.DEFAULT_ADMIN_PASSW),
  //     role: UserRole.ADMIN,
  //     active: true,
  //   }); //el usuario q se usa para hacer las tareas automaticas
  //   await userRepository.save(sytem);
  // }

  // const defaultUser = await userRepository
  //   .createQueryBuilder()
  //   .where('name = :name', {
  //     name: config.get<string>(Configuration.DEFAULT_ADMIN_USER),
  //   })
  //   .getOne();

  // if (!defaultUser) {
  //   const adminUser = userRepository.create({
  //     name: config.get<string>(Configuration.DEFAULT_ADMIN_USER),
  //     email: config.get<string>(Configuration.DEFAULT_ADMIN_email),
  //     password: config.get<string>(Configuration.DEFAULT_ADMIN_PASSW),
  //     role: UserRole.ADMIN,
  //     active: true,
  //   });

  //   return await userRepository.save(adminUser);
  // }
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
) {
  await Promise.all([
    userDefault(config, configUser),
    setDefaultFilePath(config, customConfigService),
  ]);
}
export default defaultConfig;
