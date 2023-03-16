import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';

export class FilterTravelerDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  passport: string;

  @IsOptional()
  @IsDateString()
  start_date_init: Date;

  @IsOptional()
  @IsDateString()
  start_date_end: Date;

  @IsOptional()
  @IsDateString()
  end_date_policy_init: Date;

  @IsOptional()
  @IsDateString()
  end_date_policy_end: Date;

  @IsOptional()
  @IsNumberString()
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

  @IsOptional()
  @IsNumberString()
  coverage: number;

  @IsOptional()
  @IsBooleanString()
  state: boolean;
}
