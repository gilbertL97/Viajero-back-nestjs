import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateContratorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  telf: string;

  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(200)
  addres: string;

  @MinLength(6)
  @MaxLength(250)
  file: string;

  @IsNotEmpty()
  @MaxLength(20)
  poliza: string;
}