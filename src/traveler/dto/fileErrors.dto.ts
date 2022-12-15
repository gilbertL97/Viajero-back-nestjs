import { Expose } from 'class-transformer';
import { ErrorsDto } from './error.dto';
export class FileErrorsDto {
  @Expose({ name: 'fila' })
  row: number;
  errors: ErrorsDto[];
}
