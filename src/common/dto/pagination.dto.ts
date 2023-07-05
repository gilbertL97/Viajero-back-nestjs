import { Type } from 'class-transformer';
import {
  IsNumber,
  IsNumberString,
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
  limit = 10;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset = 0;

  @IsOptional()
  @IsString()
  @Length(3, 6)
  order: Order = Order.ASC;
}
