import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsBooleanString, IsOptional } from 'class-validator';
import { CreateCoverageDto } from './create-coverage.dto';

export class UpdateCoverageDto extends PartialType(CreateCoverageDto) {
  @IsOptional()
  @IsBooleanString()
  isActive: boolean;
}
