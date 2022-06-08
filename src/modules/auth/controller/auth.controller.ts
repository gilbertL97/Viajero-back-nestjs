import { Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { AuthService } from '../sevices/auth.service';
import { LocalAuthGuard } from '../guard/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@GetUser() user: UserEntity) {
    return this.authService.login(user);
  }
}
