import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @MaxLength(2)
  @MinLength(2)
  iso2: string;
  @IsString()
  @MaxLength(3)
  @MinLength(3)
  iso: string;
  @IsOptional()
  nombre_largo: string;
  @IsOptional()
  nombre_corto: string;
  @IsString()
  @MinLength(4)
  nombre_comun: string;
}
