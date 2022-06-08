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
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt.auth.guard';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UpdateUserDto, EditProfileUserDto, CreateUserDto } from './dto';
import { UserEntity } from './entity/user.entity';
import { RoleValidationPipes } from './pipes/role-validation.pipes';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
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
  createUser(
    @Body(RoleValidationPipes) createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const data = this.userService.createUser(createUserDto);
    return data;
  }

  @Patch('/update_profile')
  updateProfile(
    @GetUser() user: UserEntity,
    @Body() editProfile: EditProfileUserDto,
  ): Promise<UserEntity> {
    const userId: number = user.id;
    const data = this.userService.updateProfile(userId, editProfile);
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

  /*@Delete('/deleteMultiple/:ids')
  deleteMultipleUsers(@Param('ids', IntArrayPipe) ids: number[]): boolean {
    return true;
  }*/
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    const data = this.userService.deleteUser(id);
    return data;
  }
}
