import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsNumberString,
} from 'class-validator';

export class CreateContratorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  client: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @MinLength(8)
  @MaxLength(15)
  telf: string;

  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(200)
  addres: string;

  @IsNotEmpty()
  @MaxLength(20)
  poliza: string;
}
