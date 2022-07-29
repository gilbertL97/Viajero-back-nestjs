import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsNumberString,
} from 'class-validator';

export class CreateCoverageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsNotEmpty()
  daily: boolean;

  @IsNumber()
  @IsNotEmpty()
  high_risk: number;
}
