import { ConfigEntity } from './../entities/config.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UpdateConfigDto } from '../dto/update-config.dto';
import { Configuration } from '../config.const';
import { CreateConfigDto } from '../dto/create-config.dto';
import { LogginService } from 'src/loggin/loggin.service';
@Injectable()
export class CustomConfigService {
  constructor(
    @InjectRepository(ConfigEntity, Configuration.POSTGRESCONNECT)
    private readonly configRepository: Repository<ConfigEntity>,
    private readonly loggingService: LogginService,
  ) {}

  async findAll(): Promise<ConfigEntity[]> {
    this.loggingService.create({
      message: `Obteniendo todos los configuraciones`,
      context: 'ConfigService',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return await this.configRepository.find();
  }

  async findOne(id: number) {
    const config = await this.configRepository.findOne({
      where: { id: id },
    });
    if (!config) throw new NotFoundException('config not found');
    this.loggingService.create({
      message: `Obteniendo la configuracion con id: ${id}`,
      context: 'ConfigService',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return config;
  }

  async update(id: number, updateConfigDto: UpdateConfigDto) {
    const conifgFind = await this.findOne(id);
    const configEdited = Object.assign(conifgFind, updateConfigDto);
    configEdited.value.replace(/\\/g, '/');
    this.loggingService.create({
      message: `Actualizando la configuracion con id: ${id}`,
      context: 'ConfigService',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return await this.configRepository.save(configEdited);
  }

  async remove(id: number) {
    const config = await this.findOne(id);
    this.loggingService.create({
      message: `Eliminando la configuracion con id: ${id}`,
      context: 'ConfigService',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return await this.configRepository.remove(config);
  }
  async findConfigByKEy(name: string) {
    const key = await this.configRepository.findOne({
      where: { key: name },
    });

    if (key) {
      this.loggingService.create({
        message: `Obteniendo la configuracion con key: ${name}`,
        context: 'ConfigService',
        level: 'info',
        createdAt: new Date().toISOString(),
      });
      return key;
    }
  }
  async insertConfig(configDto: CreateConfigDto) {
    const configEntity = this.configRepository.create(configDto);
    configEntity.value.replace(/\\/g, '/');
    this.loggingService.create({
      message: `Insertando la configuracion con key: ${configDto.key}`,
      context: 'ConfigService',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    await this.configRepository.save(configEntity);
  }
}
