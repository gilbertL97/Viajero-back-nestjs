import {
  IsDateString,
  IsEmail,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { CountryEntity } from '../../country/entities/country.entity';

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
  @MaxLength(20)
  passport: string;

  @IsOptional()
  @IsDateString()
  sale_date: Date;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date_policy: Date;

  @IsOptional()
  @IsNumberString()
  number_high_risk_days: number;

  @IsObject()
  contractor: ContratorEntity;

  @IsOptional()
  @IsObject()
  origin_country: CountryEntity;

  @IsOptional()
  @IsObject()
  nationality: CountryEntity;

  @IsObject()
  coverage: CoverageEntity;
}
