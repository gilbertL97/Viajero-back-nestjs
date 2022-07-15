import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateCoverageDto } from './create-coverage.dto';

export class UpdateCoverageDto extends PartialType(CreateCoverageDto) {
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
