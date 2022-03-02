import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
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

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    console.log(createUserDto.email);
    console.log(createUserDto.name);
    return this.userService.updateUser(parseInt(id), createUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {}
}
