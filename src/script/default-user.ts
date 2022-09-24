import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/config.const';
import { UserEntity } from 'src/user/entity/user.entity';

const setDefaultUser = async (config: ConfigService) => {
  const userRepository = getRepository<UserEntity>(UserEntity);

  const defaultUser = await userRepository
    .createQueryBuilder()
    .where('name = :email', {
      email: config.get<string>(Configuration.DEFAULT_ADMIN_USER),
    })
    .getOne();

  if (!defaultUser) {
    const adminUser = userRepository.create({
      name: config.get<string>(Configuration.DEFAULT_ADMIN_USER),
      email: config.get<string>(Configuration.DEFAULT_ADMIN_email),
      password: config.get<string>(Configuration.DEFAULT_ADMIN_PASSW),
      role: 'admin',
      active: true,
    });

    return await userRepository.save(adminUser);
  }
};

export default setDefaultUser;
