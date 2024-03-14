import { PartialType } from '@nestjs/swagger';
import { CreateLogginDto } from './create-loggin.dto';

export class UpdateLogginDto extends PartialType(CreateLogginDto) {}
