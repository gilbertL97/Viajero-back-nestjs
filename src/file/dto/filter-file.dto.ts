import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  IsNumberString,
} from 'class-validator';

export class FilterFileDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsDateString()
  start_date_create: Date;

  @IsOptional()
  @IsDateString()
  end_date_create: Date;

  @IsOptional()
  @IsNumberString()
  contractor: number;
}
