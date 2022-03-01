import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUser(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(userDto);
    return this.userRepository.save(user);
  }

  /* updateUser() {}

  deleteUser() {}*/
}
