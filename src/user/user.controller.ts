import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return 'Test de prueba';
  }

  @Get(':id')
  getHelldo(@Param() params): string {
    return `esto es una prueba de parametros ${params.id}`;
  }
}
