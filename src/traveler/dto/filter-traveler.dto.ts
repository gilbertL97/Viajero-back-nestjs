import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsArray,
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
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
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

  @Transform(({ value }) => parseInt(value)) // ver xq esto
  @IsOptional()
  @IsNumber()
  coverage: number;

  @IsOptional()
  @Transform(({ value }) => Boolean(value)) // ver xq esto
  @IsBoolean()
  state: boolean;

  @IsOptional()
  @IsArray()
  @IsNumberString(undefined, { each: true })
  idContractors: number[];

  @IsOptional()
  @IsDateString()
  effective_date: Date;

  @IsOptional()
  @IsBooleanString()
  empty_file: boolean;
}
