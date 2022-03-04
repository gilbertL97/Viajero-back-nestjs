import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
 /* @IsBoolean()
  active: string;*/
} //clase para aplicar la modficacion en cualquiera de los atributos de la entidad user
