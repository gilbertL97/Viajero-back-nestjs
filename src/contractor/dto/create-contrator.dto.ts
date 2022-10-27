import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsNumberString,
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
  @IsNumberString()
  @MinLength(8)
  @MaxLength(15)
  telf: string;

  @IsOptional()
  @MinLength(15)
  @MaxLength(200)
  addres: string;

  @IsNotEmpty()
  @MaxLength(20)
  poliza: string;
}
