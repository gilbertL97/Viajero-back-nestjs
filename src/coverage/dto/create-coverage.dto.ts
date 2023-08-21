import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumberString,
  IsOptional,
  IsBooleanString,
} from 'class-validator';

export class CreateCoverageDto {
  @ApiProperty({
    description: 'nombre',
    example: 'Garantia de Viaje',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Precio',
    example: '25',
  })
  @IsNumberString()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'SI es diaria la tarifa',
    example: 'false',
  })
  @IsBooleanString()
  @IsNotEmpty()
  daily: boolean;

  @ApiProperty({
    description: 'Precio alto riesgo',
    example: '25',
  })
  @IsNumberString()
  @IsNotEmpty()
  high_risk: number;

  @ApiProperty({
    description: 'Cantidad de Dias',
    example: '30',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  number_of_days: number;

  @ApiProperty({
    description: 'Cadena de Configuracion',
    example: 'garant+viaje',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  config_string: string;
}
