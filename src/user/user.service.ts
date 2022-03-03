import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers(userfilterDto: FilterUserDto): Promise<UserEntity[]> {
    return await this.userRepository.find(userfilterDto);
  }

  async getUser(id: number): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne(id);
    if (!user) throw new ForbiddenException('The users does not exist');
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(userDto);
    const newUser = await this.userRepository.save(user);
    delete newUser.password; // para no devolver en la res el atributo password en user
    return newUser;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.getUser(id);
    const editedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(editedUser);
  }

  async deleteUser(id: number): Promise<UserEntity> {
    const user = await this.getUser(id);
    return await this.userRepository.remove(user);
  }
}
