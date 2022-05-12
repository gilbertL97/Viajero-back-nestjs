import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class EditProfileUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'role'] as const),
) {}
