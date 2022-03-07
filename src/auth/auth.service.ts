import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(userLoginDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findUserByName(userLoginDto.name);
    // console.log(compare(userLoginDto.password, user.password));
    if (user && (await compare(userLoginDto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
