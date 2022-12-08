import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsISO31661Alpha3,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FileErrorsDto {
  @Expose({ name: 'fila' })
  row: number;

  errors: string[];
}
