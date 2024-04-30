import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByName(username);
    if (user && (await compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, active, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: UserEntity) {
    return await this.createTokens(user);
  }
  async createTokens(user: UserEntity) {
    const payload = {
      username: user.name,
      id: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '45m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    await this.userService.updateRefreshToken(user.id, refreshToken);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async verifyRefreshToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.userService.getToken(payload.id);
      if (user.refresh_token !== token)
        throw new ForbiddenException('Invalid refresh token');
      return user;
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
  async refreshTokens(token: string) {
    const user = await this.verifyRefreshToken(token);
    return await this.createTokens(user);
  }
  async logout(token: string) {
    const user = await this.verifyRefreshToken(token);
    delete user.refresh_token;
    return await this.userService.updateRefreshToken(user.id, '').catch(() => {
      return new NotFoundException('Oops ha ocurrido un problema');
    }); //borrando el token
  }
}
