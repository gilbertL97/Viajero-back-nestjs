import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dot from 'dotenv';
import { JwtStrategy } from './strategy/jwt.strategy';
dot.config();
@Module({
<<<<<<< HEAD
  providers: [AuthService, LocalStrategy, JwtStrategy],
=======
  providers: [AuthService, LocalStrategy, ConfigService],
>>>>>>> bbccd24b0a2d0401a86895973f7dbf0beb7d9541
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
<<<<<<< HEAD
      secret: 'process.env.SECRET_KEY',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
=======
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  exports: [AuthService],
>>>>>>> bbccd24b0a2d0401a86895973f7dbf0beb7d9541
})
export class AuthModule {}
