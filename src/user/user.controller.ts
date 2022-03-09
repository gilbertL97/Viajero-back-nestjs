import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { RoleValidationPipes } from './pipes/role-validation.pipes';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
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
    const data = this.userService.createUser(createUserDto);
    return data;
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(RoleValidationPipes) updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const data = this.userService.updateUser(id, updateUserDto);
    return data;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<UserEntity> {
    const data = this.userService.deleteUser(parseInt(id));
    return data;
  }
}
