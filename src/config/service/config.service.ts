import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { UpdateConfigDto } from '../dto/update-config.dto';
import { ConfigEntity } from '../entities/config.entity';
@Injectable()
export class CustomConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<ConfigEntity[]> {
    return await this.configRepository.find();
  }

  async findOne(id: number) {
    const config = await this.configRepository.findOne({
      where: { id: id },
    });
    if (!config) throw new NotFoundException('config not found');
    return config;
  }

  async update(id: number, updateConfigDto: UpdateConfigDto) {
    const conifgFind = await this.findOne(id);
    const configEdited = Object.assign(conifgFind, updateConfigDto);
    configEdited.value.replace(/\\/g, '/');
    return await this.configRepository.save(configEdited);
  }

  async remove(id: number) {
    const config = await this.findOne(id);
    return await this.configRepository.remove(config);
  }
  async findConfigByKEy(name: string) {
    const key = await this.configRepository.findOne({
      where: { key: name },
    });
    if (key) return key;
  }
}
