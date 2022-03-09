import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';
<<<<<<< HEAD
=======
import { LoginUserDto } from 'src/user/dto/login-user.dto';
>>>>>>> bbccd24b0a2d0401a86895973f7dbf0beb7d9541
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
    // console.log('entro a validar aqui');
    if (user && (await compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
<<<<<<< HEAD
  async login(user: UserEntity) {
    const payload = {
      username: user.name,
      id: user.id,
      role: user.role,
    };
=======
  async login(user: any) {
    const payload = { username: user.name, id: user.id, role: user.role };
>>>>>>> bbccd24b0a2d0401a86895973f7dbf0beb7d9541
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
