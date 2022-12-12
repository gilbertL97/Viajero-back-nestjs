import { Expose } from 'class-transformer';

export class ErrorsDto {
  @Expose({ name: 'fila' })
  row: string[];

  poroperty: string;
}
