import { ApiProperty } from '@nestjs/swagger';

export class FileErrorsTravelerDto {
  @ApiProperty({
    description: 'Fila',
    example: 2,
  })
  row: number;
  @ApiProperty({
    description: 'Nombre (Error)',
    example: 'Campo Obligatorio',
  })
  name?: string;
  @ApiProperty({
    description: 'Sexo (Advertencia)',
    example: 'Solo Puede Iniciar con M o F',
  })
  sex?: string;

  @ApiProperty({
    description: 'Fecha de Nacimiento (Advertencia)',
    example: 'Formato Invalido',
  })
  born_date?: Date | string;

  @ApiProperty({
    description: 'Correo (Advertencia)',
    example: 'Debe poseer formato de correo',
  })
  email?: string;

  @ApiProperty({
    description: 'Pasaporte (Error)',
    example: 'Pasaporte invalido',
  })
  passport?: string;

  @ApiProperty({
    description: 'Fecha de Venta(Advertencia)',
    example: 'Formato Invalido',
  })
  sale_date?: string;

  @ApiProperty({
    description: 'Fecha de Inicio(Error)',
    example: 'Fecha inicio posterior a fecha de fin',
  })
  start_date?: string;

  @ApiProperty({
    description: 'Fecha de Fin(Error)',
    example: 'Formato Invalido',
  })
  end_date_policy?: string;

  @ApiProperty({
    description: 'Pais Origen (Advertencia)',
    example: 'Tamaño de texto invalido',
  })
  origin_country?: string;

  @ApiProperty({
    description: 'Nacionalidad (Advertencia)',
    example: 'Tamaño de texto invalido',
  })
  nationality: string;

  @ApiProperty({
    description: 'Vuelo (Advertencia)',
    example: 'No se encuentra entre la longitud de letras permitidas',
  })
  flight?: string;

  @ApiProperty({
    description: 'Cant de dias (Error)',
    example: 'El valor introducido debe de tipo numerico',
  })
  number_days?: string;

  @ApiProperty({
    description: 'Cant de dias Alto Riesgo (Advertencia)',
    example: 'Cantidad de dias incorrectos',
  })
  number_high_risk_days?: string;

  @ApiProperty({
    description: 'Monto Alto Riesgo (Error)',
    example: 'El valor introducido debe de tipo numerico',
  })
  amount_days_high_risk: string;

  @ApiProperty({
    description: 'Monto dias cubiertos (Error)',
    example: 'El valor introducido  debe ser mayor a 0',
  })
  amount_days_covered?: string;

  @ApiProperty({
    description: 'Monto total (Error)',
    example: 'Campo Obligatorio',
  })
  total_amount?: string;
  @ApiProperty({
    description: 'Cobertura (Error)',
    example: 'No se encuentra entre la longitud de letras permitidas',
  })
  coverage?: string;

  @ApiProperty({
    description: 'Viajero duplicado (Advertencia)',
    example: true,
  })
  duplicate?: boolean;

  @ApiProperty({
    description: 'Otros (Error)',
    example: '[Fichero sin filas o vacio]',
  })
  others?: string[];
}
