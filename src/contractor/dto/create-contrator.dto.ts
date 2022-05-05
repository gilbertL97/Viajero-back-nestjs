import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateContratorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  client: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  telf: string;

  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(200)
  addres: string;

  @IsNotEmpty()
  @MaxLength(20)
  poliza: string;
}
