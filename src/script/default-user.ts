import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/config.const';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';

const setDefaultUser = async (config: ConfigService) => {
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
      password: config.get<string>(Configuration.DEFAULT_ADMIN_email),
      role: UserRole.CLIENT,
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
};

export default setDefaultUser;
