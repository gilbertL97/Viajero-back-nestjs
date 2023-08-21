import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({
    description: 'ISO de 2 caracteres',
    example: 'CU',
  })
  @IsString()
  @MaxLength(2)
  @MinLength(2)
  iso2: string;
  @ApiProperty({
    description: 'ISO de 3 caracteres',
    example: 'CUB',
  })
  @IsString()
  @MaxLength(3)
  @MinLength(3)
  iso: string;
  @ApiProperty({
    description: 'Nombre Largo',
    example: 'La Republica de Cuba',
  })
  @IsOptional()
  nombre_largo: string;
  @ApiProperty({
    description: 'Nombre Corto',
    example: 'Republica de Cuba',
  })
  @IsOptional()
  nombre_corto: string;
  @ApiProperty({
    description: 'Nombre Comun',
    example: 'Cuba',
  })
  @IsString()
  @MinLength(4)
  nombre_comun: string;
}
