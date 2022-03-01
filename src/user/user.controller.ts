import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<UserEntity[]> {
   return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param() params): Promise<UserEntity> {
    return this.userService.getUser(params.id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUserDto);
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
