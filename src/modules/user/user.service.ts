import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractorService } from 'src/modules/contractor/sevices/contractor.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EditProfileUserDto } from './dto/edit-profile-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserRole } from './user.role';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly contractorService: ContractorService,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUser(id: number): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne(id);
    if (!user)
      throw new ForbiddenException(`The users whit id:"${id}" does not exist`);
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(userDto);
    if (userDto.role === UserRole.CLIENT) {
      // aqui verifico que el rol sea de cliente para asignarle un tomador de seguro
      console.log(userDto.role);
      if (userDto.contractor) {
        const contrator = await this.contractorService.getContractor(
          parseInt(userDto.contractor),
        );
        user.contractors = [contrator];
      }
    }
    const newUser = await this.userRepository.save(user).catch(() => {
      throw new BadRequestException('duplicate name or email');
    });
    delete newUser.password; // para no devolver en la res el atributo password en user
    return newUser;
  }
  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.getUser(id);
    const editedUser = Object.assign(user, updateUserDto);
    if (updateUserDto.role === UserRole.CLIENT) {
      // aqui verifico que el rol sea de cliente para asignarle un tomador de seguro
      console.log(updateUserDto.role);
      if (updateUserDto.contractor) {
        const contrator = await this.contractorService.getContractor(
          parseInt(updateUserDto.contractor),
        );
        editedUser.contractors = [contrator]; //solo un contractor
      }
    }
    return await this.userRepository.save(editedUser);
  }
  async updateProfile(
    id: number,
    updateProfile: EditProfileUserDto,
  ): Promise<UserEntity> {
    const user = await this.getUser(id);
    const editedUser = Object.assign(user, updateProfile);
    console.log(id); //aqui
    return await this.userRepository.save(editedUser);
  }

  async deleteUser(id: number): Promise<UserEntity> {
    const user = await this.getUser(id);
    if (user) return await this.userRepository.remove(user);
  }
  async findUserByName(name: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('usuarios')
      .where({ name })
      .addSelect('usuarios.password')
      .getOne();
  }

  async insertClientUser(
    idContract: string,
    user: UserEntity,
  ): Promise<UserEntity> {
    const contractor = await this.contractorService.getContractor(
      parseInt(idContract),
    );
    user.contractors = [contractor];
    console.log(user);
    const newUser = await this.userRepository.save(user).catch(() => {
      throw new BadRequestException('Fail save contractor');
    });
    return newUser;
  }

  /*async deleteMultiple(id: number[]): Promise<void> {
  
    const users: UserEntity[]= id.filter(await this.getUser)
    });
  
  await this.userRepository.remove(users);*/
}
