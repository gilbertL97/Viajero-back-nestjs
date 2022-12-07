import {
  IsDateString,
  IsEmail,
  IsNegative,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CalculateNumberOfDays } from './decorator/customNumberdays.decorator';

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
  born_date: Date;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  passport: string;

  //@Type(() => string)
  @IsOptional()
  //@IsDateString()
  sale_date: Date;

  //@Type(() => string)
 // @IsDateString()
  start_date: Date;

  // @Type(() => string)
  //@IsDateString()
  end_date_policy: Date;

  @IsOptional()
  @IsNumber(undefined, {
    message: 'El valor intrucido debe de tipo numerico ,actualmente es $value',
  })
  @Min(0)
  number_high_risk_days: number;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message:
      'El Texto es muy corto . El tamaño minimo de $constraint1 caracteres, pero actualmente es $value',
  })
  @MaxLength(30, {
    message:
      'El Texto es muy largo. El tamaño minimo es de $constraint1 caracteres, pero actualmente el valor es $value',
  })
  origin_country: string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message:
      'El Texto es muy corto . El tamaño minimo de $constraint1 caracteres, pero actualmente es $value',
  })
  @MaxLength(30, {
    message:
      'El Texto es muy largo. El tamaño minimo es de $constraint1 caracteres, pero actualmente el valor es $value',
  })
  nationality: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  flight: string;

  @IsNumber(undefined, {
    message: 'El valor intrucido debe de tipo numerico ,actualmente es $value',
  })
  @Min(1)
  @CalculateNumberOfDays('start_date', 'end_date_policy')
  number_of_days: number;

  @IsNumber(undefined, {
    message: 'El valor intrucido debe de tipo numerico ,actualmente es $value',
  })
  @Min(0)
  number_of_days_import: number;

  @IsNumber(undefined, {
    message: 'El valor intrucido debe de tipo numerico ,actualmente es $value',
  })
  @Min(0)
  days_high_risk_import: number;

  @IsNumber(undefined, {
    message: 'El valor intrucido debe de tipo numerico ,actualmente es $value',
  })
  @Min(0)
  total_days_import: number;

  @IsString()
  @MinLength(2, {
    message:
      'El Texto es muy corto . El tamaño minimo de $constraint1 caracteres, pero actualmente es $value',
  })
  @MaxLength(30, {
    message:
      'El Texto es muy largo. El tamaño minimo es de $constraint1 caracteres, pero actualmente el valor es $value',
  })
  coverage: string;
}
