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
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Min(0)
  @IsNumber()
  offset?: number = 0;

  @IsString()
  @Length(3, 6)
  order?: Order = Order.ASC;
}
