import { isEmail, IsEmpty, isString } from 'class-validator';

export class CreateUserDto {
  @isString()
  @IsEmpty()
  readonly name: string;
  @isEmail()
  readonly email: string;
  @IsEmpty()
  readonly password: string;
}
