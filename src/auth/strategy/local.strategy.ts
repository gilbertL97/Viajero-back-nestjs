import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
<<<<<<< HEAD:src/auth/strategy/local.strategy.ts
import { AuthService } from '../auth.service';
=======
import { AuthService } from './auth.service';
>>>>>>> bbccd24b0a2d0401a86895973f7dbf0beb7d9541:src/auth/local.strategy.ts

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('The username or password wrong');
    }
    return user;
  }
}
