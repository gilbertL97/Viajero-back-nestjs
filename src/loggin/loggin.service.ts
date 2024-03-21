import { Injectable } from '@nestjs/common';
import { CreateLogginDto } from './dto/create-loggin.dto';
import { UpdateLogginDto } from './dto/update-loggin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './entities/loggin.entity';
import { Repository } from 'typeorm';
import { RequestEntityLog } from './entities/requestLog.entity';

@Injectable()
export class LogginService {
  constructor(
    @InjectRepository(LogEntity, 'SqliteConn')
    private readonly logginRepository: Repository<LogEntity>,
  ) {}

  // addLog(log: any): void {
  //   this.logs.push(log);
  // }

  // getLogs(): any[] {
  //   return this.logs;
  // }

  create(createLogginDto: CreateLogginDto) {
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
