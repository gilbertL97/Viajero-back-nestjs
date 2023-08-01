import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateContratorDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'SWEET SPA, S.A.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  client: string;

  @ApiProperty({
    description: 'Nombre de la carpeta',
    example: 'sweet',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  file: string;

  @ApiProperty({
    description: 'Correo del cliente',
    example: 'sweet@sweet.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'Telefono del cliente',
    example: '+5351212334',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(25)
  telf: string;

  @ApiProperty({
    description: 'Numero de analisis del cliente',
    example: '3',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  analysis_number: string;

  @ApiProperty({
    description: 'Direccion del cliente',
    example: 'Cuba /Obispo y Obrapia',
  })
  @IsOptional()
  @MinLength(15)
  @MaxLength(200)
  addres: string;

  @ApiProperty({
    description: 'Numero de Poliza del cliente',
    example: '48/6789',
  })
  @IsNotEmpty()
  @MaxLength(50)
  poliza: string;
}
