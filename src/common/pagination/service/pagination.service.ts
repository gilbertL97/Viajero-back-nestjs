import { SelectQueryBuilder } from 'typeorm';
import { PaginationResult } from '../interface/pagination.type';
import { PaginationDto } from '../dto/pagination.dto';

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  pag: PaginationDto,
): Promise<PaginationResult<T>> {
  const data = await qb
    .skip((pag.page - 1) * pag.limit)
    .take(pag.limit)
    .getMany();

  return new PaginationResult({
    total: await qb.getCount(),
    data,
  });
}
