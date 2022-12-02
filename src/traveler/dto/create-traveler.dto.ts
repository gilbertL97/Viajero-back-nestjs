import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTravelerDto {
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
  @IsDateString()
  end_date_policy: Date;

  @IsOptional()
  @IsNumber()
  number_high_risk_days: number;

  @IsNumber()
  contractor: number;

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
  coverage: number;
}
