import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dot from 'dotenv';
import { JwtStrategy } from './strategy/jwt.strategy';
dot.config();
@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'process.env.SECRET_KEY',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
