import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRole } from 'src/user/user.role';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import { Configuration } from '../config.const';
import { CreateConfigDto } from '../dto/create-config.dto';
import { UpdateConfigDto } from '../dto/update-config.dto';
import { ConfigEntity } from '../entities/config.entity';

@Injectable()
export class CustomConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>,
    private readonly userService: UserService,
  ) {}
  // async createConfig(createConfigDto: CreateConfigDto) {
  //   const configEntity: ConfigEntity =
  //     this.configRepository.create(createConfigDto);
  //   return await this.configRepository.save(configEntity);
  // }

  async findAll(): Promise<ConfigEntity[]> {
    return await this.configRepository.find();
  }

  async findOne(id: number) {
    const config = await this.configRepository.find({
      where: { id: id },
    });
    if (!config) return new NotFoundException('config not found');
    return config;
  }

  async update(id: number, updateConfigDto: UpdateConfigDto) {
    const conifgFind = await this.findOne(id);
    const configEdited = Object.assign(conifgFind, updateConfigDto);
    return await this.configRepository.save(configEdited);
  }

  remove(id: number) {
    return `This action removes a #${id} config`;
  }
  async findConfigByKEy(name: string) {
    const key = await this.configRepository.findOne({
      where: { key: name },
    });
    if (key) return key;
  }
}
