import { Exclude } from 'class-transformer';
import { IsString, IsEmail } from 'class-validator';

export class FilterUserDto {
  @Exclude()
  @IsString()
  name: string;
  @Exclude()
  @IsEmail()
  email: string;
  @Exclude()
  role: string;
}
