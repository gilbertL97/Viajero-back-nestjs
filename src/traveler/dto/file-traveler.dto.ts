import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsDateAfter } from './decorator/customDateAfter.decorator';
import { IsDateBefore } from './decorator/customDateBefore.decorator';
import { IsDateFile } from './decorator/customDateExcel.decorator';
import { CalculateNumberOfDays } from './decorator/customNumberdays.decorator';
import { IsNumberLessThan } from './decorator/customNumberlessthan.decorator';

export class FileTravelerDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2)
  sex: string;

  @IsOptional()
  // @IsDateString()
  @IsDateFile()
  born_date: Date | string;

  @IsOptional()
  @IsEmail()
  email: string;

  @Length(6, 50, {
    message:
      'El campo Pasaporte no cumple con el rango de caracteres entre 6 y 50',
  })
  @IsNotEmpty({
    message: 'el campo Pasaporte es un campo obligatorio',
  })
  passport: string;

  //@Type(() => string)
  @IsOptional()
  @IsDateFile()
  //@IsDateString()
  sale_date: Date | string;

  //@Type(() => string)
  // @IsDateString()
  @IsDateBefore('end_date_policy', {
    message: 'La fecha de fin no es posterior a la fecha $value',
  })
  @IsDateFile()
  start_date: Date | string;

  // @Type(() => string)
  //@IsDateString()
  @IsDateAfter('start_date', {
    message: 'La fecha de  inicio no  es anterior a la fecha $value',
  })
  @IsDateFile()
  end_date_policy: Date | string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message:
      'El Texto es muy corto . El tamaño minimo de $constraint caracteres, pero actualmente es $value',
  })
  @MaxLength(30, {
    message:
      'El Texto es muy largo. El tamaño minimo es de $constraint caracteres, pero actualmente el valor es $value',
  })
  origin_country: string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message:
      'El Texto es muy corto . El tamaño minimo de $constraint caracteres, pero actualmente es $value',
  })
  @MaxLength(30, {
    message:
      'El Texto es muy largo. El tamaño minimo es de $constraint caracteres, pero actualmente el valor es $value',
  })
  nationality: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  flight: string;

  @IsNumber(undefined, {
    message: 'El valor intrucido debe de tipo numerico ,actualmente es $value',
  })
  @Min(1)
  @CalculateNumberOfDays('start_date', 'end_date_policy')
  number_days: number;

  @IsOptional()
  @IsNumber(undefined, {
    message: 'El valor intrucido debe de tipo numerico ,actualmente es $value',
  })
  @Min(0)
  @IsNumberLessThan('number_days', {
    message: '$property debe ser menor la cantidad de dias: $value',
  })
  number_high_risk_days: number;

  @IsNumber(undefined, {
    message: 'El valor intrucido debe de tipo numerico ,actualmente es $value',
  })
  @Min(0)
  amount_days_covered: number;

  @IsNumber(undefined, {
    message:
      'El valor introducido debe ser tipo numerico ,actualmente es $value',
  })
  @Min(0)
  amount_days_high_risk: number;

  @IsNumber(undefined, {
    message: 'El valor introducido debe ser tipo numerico ',
  })
  @Min(0, {
    message: 'El valor introducido debe ser mayir que 0',
  })
  total_amount: number;

  @Length(4, 20, {
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
  @IsNotEmpty({
    message: 'El campo Cobertura es un campo obligatorio',
  })
  coverage: string;
}
