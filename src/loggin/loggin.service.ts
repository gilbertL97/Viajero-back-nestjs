import { Injectable } from '@nestjs/common';
import { CreateLogginDto } from './dto/create-loggin.dto';
import { UpdateLogginDto } from './dto/update-loggin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './entities/loggin.entity';
import { Repository } from 'typeorm';
import { Configuration } from 'src/config/config.const';

@Injectable()
export class LogginService {
  constructor(
    @InjectRepository(LogEntity, Configuration.SQLITECONNECT)
    private readonly logginRepository: Repository<LogEntity>,
  ) {}

  // addLog(log: any): void {
  //   this.logs.push(log);
  // }

  // getLogs(): any[] {
  //   return this.logs;
  // }

  async create(createLogginDto: CreateLogginDto) {
    const createLogEntity = this.logginRepository.create(createLogginDto);
    await this.logginRepository.save(createLogEntity);
    return 'This action adds a new loggin';
  }

  findAll() {
    return `This action returns all loggin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loggin`;
  }

  update(id: number, updateLogginDto: UpdateLogginDto) {
    return `This action updates a #${id} loggin`;
  }

  remove(id: number) {
    return `This action removes a #${id} loggin`;
  }
}
