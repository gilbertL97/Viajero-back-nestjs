import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsDateString,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';

export class FilterContractorDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  client: string;

  @IsOptional()
  @IsNumberString()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  file: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(25)
  telf: string;

  @IsOptional()
  @MinLength(15)
  @MaxLength(200)
  addres: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(20)
  poliza: string;

  @IsOptional()
  @IsDateString()
  dateInvoicing: Date;
}
