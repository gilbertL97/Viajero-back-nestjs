import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {} //clase para aplicar la modficacion en cualquiera de los atributos de la entidad user
