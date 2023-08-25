import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsISO31661Alpha3,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsDateAfter } from './decorator/dateAfter.decorator';

export class CreateTravelerDto {
  @ApiProperty({
    description: 'nombre',
    example: 'Gilbert Suarez',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'sexo',
    example: 'M',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2)
  sex: string;

  @ApiProperty({
    description: 'fecha de Nacimiento',
    example: '1997-01-01',
  })
  @IsOptional()
  @IsDateString()
  born_date: Date;

  @ApiProperty({
    description: 'correo',
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'pasaporte',
    example: 'T35782090',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  passport: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  flight: string;

  //@Type(() => string)
  @ApiProperty({
    description: 'fecha de Venta',
    example: '2023-01-13',
  })
  @IsOptional()
  @IsDateString()
  sale_date: Date;

  //@Type(() => string)
  @ApiProperty({
    description: 'fecha de Inicio',
    example: '2023-01-24',
  })
  @IsDateString()
  start_date: Date;

  // @Type(() => string)
  @ApiProperty({
    description: 'fecha de Fin',
    example: '2023-02-23',
  })
  @IsDateAfter('start_date')
  @IsDateString()
  @IsNotEmpty()
  end_date_policy: Date;

  @ApiProperty({
    description: 'Cantida dias alto Riesgo',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  number_high_risk_days: number;

  @IsNumber()
  contractor: number;

  @IsOptional()
  @IsISO31661Alpha3()
  origin_country: string;

  @IsOptional()
  @IsISO31661Alpha3()
  nationality: string;

  @IsNumber()
  coverage: number;
}
