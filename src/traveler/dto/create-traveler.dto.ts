import {
  IsDateString,
  IsEmail,
  IsNumberString,
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
  @MaxLength(1)
  sex: string;

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
  @IsNumberString()
  number_high_risk_days: number;

  @IsNumberString()
  contractor: string;

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

  @IsNumberString()
  coverage: string;
}
