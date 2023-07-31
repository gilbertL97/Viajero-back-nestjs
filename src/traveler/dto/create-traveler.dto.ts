import {
  IsDateString,
  IsEmail,
  IsISO31661Alpha3,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsDateBefore } from './decorator/dateBefore.decorator';

export class CreateTravelerDto {
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2)
  sex: string;

  @IsOptional()
  @IsDateString()
  born_date: Date;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  passport: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  flight: string;

  //@Type(() => string)
  @IsOptional()
  @IsDateString()
  sale_date: Date;

  //@Type(() => string)
  @IsDateString()
  start_date: Date;

  // @Type(() => string)
  @IsDateBefore('start_date')
  @IsDateString()
  @IsNotEmpty()
  end_date_policy: Date;

  @IsOptional()
  @IsNumber()
  number_high_risk_days: number;

  @IsNumber()
  contractor: number;

  @IsOptional()
  @IsISO31661Alpha3()
  origin_country: string;

  @IsOptional()
  @IsISO31661Alpha3()
  nationality: string;

  @IsNumber()
  coverage: number;
}
