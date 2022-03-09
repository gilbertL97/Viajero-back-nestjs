<<<<<<< HEAD
import { Controller } from '@nestjs/common';

@Controller()
export class AppController {}
=======
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UserEntity } from './user/entity/user.entity';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }
}
>>>>>>> bbccd24b0a2d0401a86895973f7dbf0beb7d9541
