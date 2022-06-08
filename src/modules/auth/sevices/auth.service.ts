import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/modules/user/entity/user.entity';

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
    const payload = {
      username: user.name,
      id: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
