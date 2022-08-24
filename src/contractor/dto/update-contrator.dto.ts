import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateContratorDto } from './create-contrator.dto';

export class UpdateContratorDto extends PartialType(CreateContratorDto) {
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
