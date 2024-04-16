import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { IsCustomDateBefore } from '../../common/validation/decorator/customDateBefore.decorator';
import { IsDateFile } from '../../common/validation/decorator/customDateExcel.decorator';
import { CalculateNumberOfDays } from '../../common/validation/decorator/customNumberdays.decorator';
import { IsNumberLessThan } from '../../common/validation/decorator/customNumberlessthan.decorator';

export class FileTravelerDto {
  @IsString({ groups: ['errors'], message: 'No es de tipo string' })
  @Length(5, 70, {
    groups: ['errors'],
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
  @IsNotEmpty({
    always: true,
    groups: ['errors'],
    message: 'Campo Obligatorio',
  })
  name: string;

  @IsOptional({ groups: ['warnings'] })
  @IsString({ groups: ['warnings'] })
  @Length(1, 10, {
    groups: ['warnings'],
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
  sex: string;

  @IsOptional({ groups: ['warnings'] })
  // @IsDateString()
  @IsDateFile({ groups: ['warnings'] })
  born_date: Date | string;

  @IsOptional({ groups: ['warnings'] })
  @IsEmail(undefined, {
    groups: ['warnings'],
    message: 'Debe poseer formato de correo',
  })
  email: string;

  @Length(6, 60, {
    groups: ['errors'],
    message: 'Pasaporte invalido',
  })
  @IsNotEmpty({
    always: true,
    groups: ['errors'],
    message: 'Campo Obligatorio',
  })
  passport: string;

  //@Type(() => string)
  @IsOptional({ groups: ['warnings'] })
  @IsDateFile({ groups: ['warnings'] })
  //@IsDateString()
  sale_date: Date | string;

  //@Type(() => string)
  // @IsDateString()
  @IsCustomDateBefore('end_date_policy', {
    groups: ['errors'],
    message: 'Fecha inicio posterior a fecha de fin ',
  })
  @IsNotEmpty({
    always: true,
    groups: ['errors'],
    message: 'Campo Obligatorio',
  })
  @IsDateFile({ groups: ['errors'] })
  start_date: Date | string;

  @IsNotEmpty({ groups: ['errors'], message: 'Campo Obligatorio' })
  @IsDateFile({ groups: ['errors'] })
  end_date_policy: Date | string;

  @IsOptional({ groups: ['warnings'] })
  @IsString({ groups: ['warnings'] })
  @Length(2, 40, {
    groups: ['warnings'],
    message: 'Tamaño de texto invalido .',
  })
  origin_country: string;

  @IsOptional({ groups: ['warnings'] })
  @IsString({ groups: ['warnings'] })
  @Length(2, 40, {
    groups: ['warnings'],
    message: 'Tamaño de texto invalido .',
  })
  nationality: string;

  @IsOptional({ groups: ['warnings'] })
  @IsString({ groups: ['warnings'] })
  @Length(4, 20, {
    groups: ['warnings'],
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
  flight: string;

  @IsNumber(undefined, {
    groups: ['errors'],
    message: 'El valor introducido debe de tipo numerico.',
  })
  @Min(1, { groups: ['errors'] })
  @IsNotEmpty({
    always: true,
    groups: ['errors'],
    message: 'Campo Obligatorio',
  })
  @CalculateNumberOfDays('start_date', 'end_date_policy', {
    groups: ['errors'],
  })
  number_days: number;

  @IsOptional({ groups: ['errors'] })
  @IsNumber(undefined, {
    groups: ['errors'],
    message: 'El valor introducido  debe de tipo numerico.',
  })
  @Min(0, { groups: ['errors'] })
  @IsNumberLessThan('number_days', {
    groups: ['errors'],
    message: 'Cantidad de dias incorrectos',
  })
  number_high_risk_days: number;

  @IsNumber(undefined, {
    groups: ['errors'],
    message: 'El valor introducido  debe de tipo numerico',
  })
  @Min(0, {
    groups: ['errors'],
    message: 'El valor introducido  debe ser mayor a 0',
  })
  @IsNotEmpty({
    message: 'Campo Obligatorio',
  })
  amount_days_covered: number;

  @IsNumber(undefined, {
    groups: ['errors'],
    message: 'El valor introducido debe ser tipo numerico .',
  })
  @IsOptional({ groups: ['errors'] })
  @Min(0, { groups: ['errors'] })
  amount_days_high_risk: number;

  @IsNumber(undefined, {
    groups: ['errors'],
    message: 'El valor introducido debe ser tipo numerico ',
  })
  @Min(0, {
    groups: ['errors'],
    message: 'El valor introducido debe ser mayor que 0',
  })
  @IsNotEmpty({
    always: true,
    groups: ['errors'],
    message: 'Campo Obligatorio',
  })
  total_amount: number;

  @Length(4, 40, {
    groups: ['errors'],
    message: 'No se encuentra entre la longitud de letras permitidas',
  })
  @IsNotEmpty({ groups: ['errors'], message: 'Campo Obligatorio' })
  coverage: string;
}
