import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../user.role';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  password: string;

  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @ValidateIf(
    (user: CreateUserDto) =>
      user.role === UserRole.CLIENT || user.role === UserRole.CONSULTAGENT,
  )
  // @IsOptional()
  contractor: number;
}
