import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsNumberString,
  IsOptional,
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

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  folder: string;

  @IsBoolean()
  @IsNotEmpty()
  daily: boolean;

  @IsNumberString()
  @IsNotEmpty()
  high_risk: number;

  @IsOptional()
  @IsNumber()
  number_of_days: number;
}
