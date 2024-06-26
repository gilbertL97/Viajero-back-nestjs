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
import { DateHelper } from 'src/common/date/helper/date.helper';
import { IsDateBefore } from 'src/common/validation/decorator/dateBefore.decorator';
import { IsRequiredIfExist } from 'src/common/validation/decorator/isRequiredIfExist';

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
    description:
      'Rango de Fecha de Facturacion Inicial el valor por defecto es el ultimo dia del año en curso',
    example: '2023-08-13',
    required: false,
  })
  @IsDateBefore('dateEndFactRange', {
    message: 'Fecha inicio posterior a fecha de fin ',
  })
  @IsOptional()
  @IsDateString()
  dateInitFactRange: string = DateHelper.getFirstDateOfYear(new Date());
  @ApiProperty({
    description:
      'Rango de Fecha de Facturacion Final el valor por defecto es el ultimo dia del año en curso',
    example: '2023-08-11',
    required: false,
  })
  @IsRequiredIfExist('dateInitFactRange')
  @IsOptional()
  @IsDateString()
  dateEndFactRange: string = DateHelper.getLastDateOfYear(new Date());
}
