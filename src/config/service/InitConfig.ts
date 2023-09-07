import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/config.const';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
import { ConfigEntity } from '../entities/config.entity';

async function userDefault(config: ConfigService): Promise<UserEntity> {
  const userRepository = getRepository<UserEntity>(UserEntity);
  const systemUser = await userRepository
    .createQueryBuilder()
    .where('name = :name', {
      name: 'system',
    })
    .getOne();
  if (!systemUser) {
    const sytem = userRepository.create({
      name: 'system',
      email: 'system' + config.get<string>(Configuration.DEFAULT_ADMIN_email),
      password: config.get<string>(Configuration.DEFAULT_ADMIN_PASSW),
      role: UserRole.ADMIN,
      active: true,
    }); //el usuario q se usa para hacer las tareas automaticas
    await userRepository.save(sytem);
  }

  const defaultUser = await userRepository
    .createQueryBuilder()
    .where('name = :name', {
      name: config.get<string>(Configuration.DEFAULT_ADMIN_USER),
    })
    .getOne();

  if (!defaultUser) {
    const adminUser = userRepository.create({
      name: config.get<string>(Configuration.DEFAULT_ADMIN_USER),
      email: config.get<string>(Configuration.DEFAULT_ADMIN_email),
      password: config.get<string>(Configuration.DEFAULT_ADMIN_PASSW),
      role: UserRole.ADMIN,
      active: true,
    });

    return await userRepository.save(adminUser);
  }
}
async function setDefaultFilePath(config: ConfigService) {
  await Promise.all([
    findOrCreateConfig(Configuration.FILES_PATH, config),
    findOrCreateConfig(Configuration.TEMP_FILE, config),
    findOrCreateConfig(Configuration.FIlES_PROCESSED_PATH, config),
    findOrCreateConfig(Configuration.FILES_LOGS_PATH, config),
  ]);
}
async function findOrCreateConfig(key: string, config: ConfigService) {
  const configRepository = getRepository<ConfigEntity>(ConfigEntity);
  const existConfig = await configRepository.findOne({ where: { key: key } });
  if (!existConfig) {
    const configEntity = configRepository.create({
      key: key,
      value: config.get<string>(key),
    });
    configEntity.value.replace(/\\/g, '/');
    configRepository.save(configEntity);
  }
}
async function defaultConfig(config: ConfigService) {
  await Promise.all([userDefault(config), setDefaultFilePath(config)]);
}
export default defaultConfig;
