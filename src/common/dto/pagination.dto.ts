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
  @Min(1)
  @Type(() => Number)
  limit = 10;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsString()
  @Length(3, 6)
  order: Order = Order.ASC;
}
