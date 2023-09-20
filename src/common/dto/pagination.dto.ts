import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Order } from '../constants/order';

export class PaginationDto {
  @ApiProperty({
    description: 'Limite',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  limit = 10;

  @ApiProperty({
    description: 'Pagina',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @ApiProperty({
    description: 'Orden',
    example: 'ASC',
  })
  @IsOptional()
  @IsString()
  @Length(3, 6)
  order: Order = Order.ASC;
}
