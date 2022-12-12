import { Expose } from 'class-transformer';
export class FileErrorsDto {
  @Expose({ name: 'fila' })
  row: number;

  errors: string[];
}
