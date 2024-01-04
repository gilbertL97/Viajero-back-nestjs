import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator/user.decorator';
import { LoginUserDto } from 'src/user/dto';

import { UserEntity } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local.auth.guard';

@Controller('auth')
@ApiTags('Autorizacion')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({ description: 'Usuario Logueado' })
  @ApiUnauthorizedResponse({ description: 'Credenciales Invalidas' })
  @ApiBody({
    type: LoginUserDto,
  })
  @Post('/login')
  async login(@GetUser() user: UserEntity) {
    return this.authService.login(user);
  }
  @Post('/refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
  @Post('/logout')
  async logout(@Body('refresh_token') refreshToken: string) {
    const token = await this.authService.logout(refreshToken);
    if (token) return HttpStatus.OK;
  }
}
