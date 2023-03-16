import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateContratorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  client: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  file: string;

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
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  analysis_number: string;

  @IsOptional()
  @MinLength(15)
  @MaxLength(200)
  addres: string;

  @IsNotEmpty()
  @MaxLength(50)
  poliza: string;
}
