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
    message: 'Campo Obligatorio',
  })
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 10, {
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
  @Length(6, 60, {
    message: 'Pasaporte invalido',
  })
  @IsNotEmpty({
    message: 'Campo Obligatorio',
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
    message: 'Fecha inicio posterior a fecha de fin ',
  })
  @IsNotEmpty({
    message: 'Campo Obligatorio',
  })
  @IsDateFile()
  start_date: Date | string;

  // @Type(() => string)
  //@IsDateString()
  // @IsDateAfter('start_date', {
  //   message: 'Fecha inicio anterior a fecha de fin ',
  // })
  @IsNotEmpty({
    message: 'Campo Obligatorio',
  })
  @IsDateFile()
  end_date_policy: Date | string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'El Texto es muy corto .',
  })
  @MaxLength(40, {
    message: 'El Texto es muy largo.',
  })
  origin_country: string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'El Texto es muy corto .',
  })
  @MaxLength(30, {
    message: 'El Texto es muy largo. ',
  })
  nationality: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  flight: string;

  @IsNumber(undefined, {
    message: 'El valor introducido debe de tipo numerico.',
  })
  @Min(1)
  @IsNotEmpty({
    message: 'Campo Obligatorio',
  })
  @CalculateNumberOfDays('start_date', 'end_date_policy')
  number_days: number;

  @IsOptional()
  @IsNumber(undefined, {
    message: 'El valor introducido  debe de tipo numerico.',
  })
  @Min(0)
  @IsNumberLessThan('number_days', {
    message: 'Cantidad de dias incorrectos',
  })
  number_high_risk_days: number;

  @IsNumber(undefined, {
    message: 'El valor introducido  debe de tipo numerico',
  })
  @Min(0)
  @IsNotEmpty({
    message: 'Campo Obligatorio',
  })
  amount_days_covered: number;

  @IsNumber(undefined, {
    message: 'El valor introducido debe ser tipo numerico .',
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
    message: 'Campo Obligatorio',
  })
  total_amount: number;

  @Length(4, 40, {
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
  @IsNotEmpty({
    message: 'Campo Obligatorio',
  })
  coverage: string;
}
