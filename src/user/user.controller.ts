import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): string {
    return 'Test de prueba';
  }

  @Get(':id')
  getUser(@Param() params): string {
    return `esto es una prueba de parametros ${params.id}`;
  }

  @Post()
  updateUser(): string {
    return 'Test de prueba';
  }

  @Delete(':id')
  deleteUser(@Param() params): string {
    return `esto es una prueba de parametros ${params.id}`;
  }
}
