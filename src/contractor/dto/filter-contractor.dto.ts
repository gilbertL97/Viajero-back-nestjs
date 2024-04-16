import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsDateString,
  IsNumberString,
  IsArray,
} from 'class-validator';
import { IsCustomDateBefore } from 'src/common/validation/decorator/customDateBefore.decorator';

export class FilterContractorDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'SWEET SPA, S.A.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  client: string;
  @ApiProperty({
    description: 'Identificador del cliente',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id: number;

  @ApiProperty({
    description: 'Nombre de la carpeta',
    example: 'sweet',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  file: string;

  @ApiProperty({
    description: 'Correo del cliente',
    example: 'sweet@sweet.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'Telefono del cliente',
    example: '+5351212334',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(25)
  telf: string;

  @ApiProperty({
    description: 'Direccion del cliente',
    example: 'Cuba /Obispo y Obrapia',
    required: false,
  })
  @IsOptional()
  @MinLength(15)
  @MaxLength(200)
  addres: string;

  @ApiProperty({
    description: 'Numero de Poliza del cliente',
    example: '48/6789',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(20)
  poliza: string;

  @ApiProperty({
    description: 'Fecha de Facturacion',
    example: '2023-08-13',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateInvoicing: Date;
  @ApiProperty({
    description: 'Identificadore de los clientes',
    example: [3, 6, 7],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumberString(undefined, { each: true })
  ids: number[];

  @ApiProperty({
    description: 'Rango de Fecha de Facturacion Inicial',
    example: '2023-08-13',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateInitFactRange: string;
  @ApiProperty({
    description: 'Rango de Fecha de Facturacion Final',
    example: '2023-08-11',
    required: false,
  })
  @IsCustomDateBefore('dateInitFactRange', {
    message: 'Fecha inicio posterior a fecha de fin ',
  })
  @IsOptional()
  @IsDateString()
  dateEndFactRange: string;
}
