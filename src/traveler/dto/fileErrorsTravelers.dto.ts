import { ApiProperty } from "@nestjs/swagger";

export class FileErrorsTravelerDto {
  @ApiProperty({
    description: 'Fila',
    example: 2,
  })
  row: number;
  @ApiProperty({
    description: 'nombre',
    example: 'Gilbert Suarez',
  })
  name?: string;

  sex?: string;

  @ApiProperty({
    description: 'Fila',
    example: 2,
  })
  born_date?: Date | string;

  email?: string;

  passport?: string;

  sale_date?: string;

  start_date?: string;

  end_date_policy?: string;

  origin_country?: string;

  nationality: string;

  flight?: string;

  number_days?: string;

  number_high_risk_days?: string;

  amount_days_high_risk: string;

  amount_days_covered?: string;

  total_amount?: string;

  coverage?: string;

  duplicate?: boolean;

  others?: string[];

//   @ApiProperty({
//     description: 'nombre',
//     example: 'Gilbert Suarez',
//   })

//   @ApiProperty({
//     description: 'sexo',
//     example: 'M',
//     required: false,
//   })
//   @ApiProperty({
//     description: 'fecha de Nacimiento',
//     example: '1997-01-01',
//     required: false,
//   })
//   @ApiProperty({
//     description: 'correo',
//     example: 'example@gmail.com',
//     required: false,
//   })
//   @ApiProperty({
//     description: 'pasaporte',
//     example: 'T35782090',
//   })
//   @ApiProperty({
//     description: 'fecha de Venta',
//     example: '2023-01-13',
//     required: false,
//   })
//   @ApiProperty({
//     description: 'fecha de Inicio',
//     example: '2023-01-24',
//   })
//  @ApiProperty({
//     description: 'fecha de Fin',
//     example: '2023-02-23',
//   })
//   @ApiProperty({
//     description: 'Cantida dias alto Riesgo',
//     example: 3,
//     required: false,
//   })
//   @ApiProperty({
//     description: 'Id del Contratante (de ser Cliente no es Necesario)',
//     example: 3,
//   })
//   @ApiProperty({
//     description: 'Pais origen',
//     example: 'CUB',
//     required: false,
//   })
//   @ApiProperty({
//     description: 'Nacionalidad',
//     example: 'CUB',
//     required: false,
//   })
//   @ApiProperty({
//     description: 'Cobertura',
//     example: 25,
//   })
}
