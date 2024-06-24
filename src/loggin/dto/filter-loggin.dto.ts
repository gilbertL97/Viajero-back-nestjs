import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsNumberString,
} from 'class-validator';

export class FilterLogginDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  message?: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  context?: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  level?: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  userAgent?: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  requestId?: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  ip?: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  method?: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  url?: string;
  @IsOptional()
  @IsNumberString()
  userId?: number;
  @IsOptional()
  @IsDateString()
  createdAtInit?: string;
  @IsOptional()
  @IsString()
  @IsDateString()
  createdAtEnd?: string;
}
