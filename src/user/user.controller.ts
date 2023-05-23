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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UpdateUserDto, EditProfileUserDto, CreateUserDto } from './dto';
import { UserEntity } from './entity/user.entity';
import { RoleValidationPipes } from './pipes/role-validation.pipes';
import { UserRole } from './user.role';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
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
    console.log(createUserDto);
    const data = this.userService.createUser(createUserDto);
    return data;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Patch('/change_password')
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

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    const data = this.userService.deleteUser(id);
    return data;
  }
}
