import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from 'src/config/config.const';
import { Repository } from 'typeorm';
import { LogEntity } from '../entities/loggin.entity';
import { FilterLogginDto } from '../dto/filter-loggin.dto';
import { PaginationResult } from 'src/common/pagination/interface/pagination.type';
import { paginate } from 'src/common/pagination/service/pagination.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

export class LogginRepository extends Repository<LogEntity> {
  constructor(
    @InjectRepository(LogEntity, Configuration.SQLITECONNECT)
    repository: Repository<LogEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async getLogs(
    filterLogginDto: FilterLogginDto,
    pag: PaginationDto,
  ): Promise<PaginationResult<LogEntity>> {
    const {
      userId,
      level,
      context,
      createdAtInit,
      createdAtEnd,
      ip,
      method,
      url,
      userAgent,
    } = filterLogginDto;
    const query = this.createQueryBuilder('loggin');
    if (userId) {
      query.where('loggin.userId = :userId', { userId });
    }
    if (level) {
      query.where('loggin.level = :level', { level });
    }
    if (context) {
      query.where('loggin.context = :context', { context });
    }
    if (createdAtInit) {
      query.where('loggin.createdAt >= :createdAtInit', { createdAtInit });
    }
    if (createdAtEnd) {
      query.where('loggin.createdAt <= :createdAtEnd', { createdAtEnd });
    }
    if (ip) {
      query.where('loggin.ip = :ip', { ip });
    }
    if (method) {
      query.where('loggin.method = :method', { method });
    }
    if (url) {
      query.where('loggin.url = :url', { url });
    }
    if (userAgent) {
      query.where('loggin.userAgent = :userAgent', { userAgent });
    }
    query.orderBy('loggin.id', 'DESC');
    return await paginate(query, pag);
  }
}
