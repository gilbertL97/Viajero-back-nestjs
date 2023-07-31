import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'usuario1',
  })
  username: string;
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  @ApiProperty({
    description: 'Contraseña de usuario',
    example: 'password',
  })
  password: string;
}
