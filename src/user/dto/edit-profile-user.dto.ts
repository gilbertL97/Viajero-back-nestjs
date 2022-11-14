import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class EditProfileUserDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  passwordBefore: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  passwordNew1: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  passwordNew2: string;
}
