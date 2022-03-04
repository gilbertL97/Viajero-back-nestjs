import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<UserEntity[]> {
    const data = this.userService.getUsers();
    return data;
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    const data = this.userService.getUser(id);
    return data;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const data = this.userService.createUser(createUserDto)
    return data;
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const data = this.userService.updateUser(parseInt(id), updateUserDto);
    return data;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<UserEntity> {
    const data = this.userService.deleteUser(parseInt(id));
    return data;
  }
}
