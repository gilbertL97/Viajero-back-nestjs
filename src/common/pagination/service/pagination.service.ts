import { SelectQueryBuilder } from 'typeorm';
import { PaginationResult } from '../interface/pagination.type';
import { PaginationDto } from '../dto/pagination.dto';

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginationDto,
): Promise<PaginationResult<T>> {
  const offset = (options.page - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();

  return new PaginationResult({
    total: await qb.getCount(),
    data,
  });
}
