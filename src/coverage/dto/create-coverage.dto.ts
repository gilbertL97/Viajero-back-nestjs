import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsNumberString,
  IsOptional,
  IsBooleanString,
} from 'class-validator';

export class CreateCoverageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  price: number;

  @IsBooleanString()
  @IsNotEmpty()
  daily: boolean;

  @IsNumberString()
  @IsNotEmpty()
  high_risk: number;

  @IsOptional()
  @IsNumberString()
  number_of_days: number;
}
