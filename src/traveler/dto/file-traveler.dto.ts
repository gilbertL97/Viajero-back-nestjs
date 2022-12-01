import {
  IsDateString,
  IsEmail,
  IsNegative,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @IsDateString()
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
  @IsDateString()
  sale_date: Date;

  //@Type(() => string)
  @IsDateString()
  start_date: Date;

  // @Type(() => string)
  @IsDateString()
  end_date_policy: Date;

  @IsOptional()
  @IsNumber()
  number_high_risk_days: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  origin_country: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  nationality: string;

  @IsNumber()
  number_of_days: number;
 
  @IsNumber()
  number_of_days_import: number;

  @IsNumber()
  days_high_risk_import: number;

  @IsNumber()
  total_days_import: number;
}
