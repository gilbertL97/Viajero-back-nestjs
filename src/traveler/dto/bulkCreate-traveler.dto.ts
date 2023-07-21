import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsNumberString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateTravelerDto } from './create-traveler.dto';

export class BulkCreateTravelerDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @IsInstance(CreateTravelerDto, { each: true })
  @Type(() => CreateTravelerDto)
  travelers: CreateTravelerDto[];
  @IsNumberString()
  @Min(1)
  @IsNotEmpty()
  idContractor: number;
}
