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
  @Length(5, 70, {
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
  @IsNotEmpty({
    message: 'El Campo Obligatorio',
  })
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 2, {
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
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
    message: 'El Campo Obligatorio',
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
    message: 'La fecha inicio no es anterior a la fecha de fin ',
  })
  @IsNotEmpty({
    message: 'El Campo Obligatorio',
  })
  @IsDateFile()
  start_date: Date | string;

  // @Type(() => string)
  //@IsDateString()
  @IsDateAfter('start_date', {
    message: 'La fecha de fin no es posterior a la fecha inicio',
  })
  @IsNotEmpty({
    message: 'El Campo Obligatorio',
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
  @IsNotEmpty({
    message: 'El Campo Obligatorio',
  })
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
  @IsNotEmpty({
    message: 'El Campo Obligatorio',
  })
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
    message: 'El valor introducido debe ser mayor que 0',
  })
  @IsNotEmpty({
    message: 'El Campo Obligatorio',
  })
  total_amount: number;

  @Length(4, 20, {
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
  @IsNotEmpty({
    message: 'El Campo Obligatorio',
  })
  coverage: string;
}
