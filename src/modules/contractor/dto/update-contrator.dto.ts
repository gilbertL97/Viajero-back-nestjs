import { PartialType } from '@nestjs/mapped-types';
import { CreateContratorDto } from './create-contrator.dto';

export class UpdateContratorDto extends PartialType(CreateContratorDto) {}
