import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorator/user.decorator';
import { LoginUserDto } from 'src/user/dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@GetUser() user: UserEntity) {
    return this.authService.login(user);
  }
}
