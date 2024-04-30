import { ConfigEntity } from './../entities/config.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UpdateConfigDto } from '../dto/update-config.dto';
import { Configuration } from '../config.const';
import { CreateConfigDto } from '../dto/create-config.dto';
@Injectable()
export class CustomConfigService {
  constructor(
    @InjectRepository(ConfigEntity, Configuration.POSTGRESCONNECT)
    private readonly configRepository: Repository<ConfigEntity>,
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
  async insertConfig(configDto: CreateConfigDto) {
    const configEntity = this.configRepository.create(configDto);
    configEntity.value.replace(/\\/g, '/');
    await this.configRepository.save(configEntity);
  }
}
