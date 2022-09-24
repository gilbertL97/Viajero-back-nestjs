import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  name: string;
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  password: string;
}
