import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogginModel } from './dto/logginModel.dto';
import { LogginRepository } from './repository/loggin.repository';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { FilterLogginDto } from './dto/filter-loggin.dto';
import { AsyncLocalStorage } from 'async_hooks';
import { StoreModel } from 'src/common/store/model/Store.model';

@Injectable({ scope: Scope.TRANSIENT })
export class LogginService {
  constructor(
    @InjectRepository(LogginRepository)
    private readonly logginRepository: LogginRepository,
    private readonly als: AsyncLocalStorage<StoreModel>,
  ) {}

  // addLog(log: any): void {
  //   this.logs.push(log);
  // }

  // getLogs(): any[] {
  //   return this.logs;
  // }

  async create(createLogginDto: LogginModel) {
    if (this.als.getStore()) {
      const { message, context, level, createdAt, errorStack } =
        createLogginDto;
      const { userAgent, requestId, ip, method, url, userId } =
        this.als.getStore();
      const createLogEntity = this.logginRepository.create({
        message,
        context,
        level,
        userId,
        createdAt,
        errorStack,
        userAgent,
        requestId,
        ip,
        method,
        url,
      });

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      // await this.logginRepository.save(createLogEntity);
      return 'This action adds a new loggin';
=======
      console.log(createLogEntity);
      await this.logginRepository.save(createLogEntity);
>>>>>>> b5c009de30a5436f7a0bea72d4847304f1f44ca2
=======
      console.log(createLogEntity);
      await this.logginRepository.save(createLogEntity);
>>>>>>> b5c009de30a5436f7a0bea72d4847304f1f44ca2
=======
      console.log(createLogEntity);
      await this.logginRepository.save(createLogEntity);
>>>>>>> b5c009de30a5436f7a0bea72d4847304f1f44ca2
    }
  }

  findAll(pag: PaginationDto, logginFilter: FilterLogginDto) {
    return this.logginRepository.getLogs(logginFilter, pag);
  }

  findOne(id: number) {
    return `This action returns a #${id} loggin`;
  }

  update(id: number) {
    return `This action updates a #${id} loggin`;
  }

  remove(id: number) {
    return `This action removes a #${id} loggin`;
  }
}
