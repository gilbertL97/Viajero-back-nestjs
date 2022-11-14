import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { ContractorService } from 'src/contractor/contractor.service';
import { TravelerService } from 'src/traveler/service/traveler.service';
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
    @Inject(forwardRef(() => ContractorService))
    private readonly contractorService: ContractorService,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({ relations: ['contractors'] });
  }

  async getUser(id: number): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: id },
      relations: ['contractors'],
    });
    if (!user)
      throw new ForbiddenException(`The users whit id:"${id}" does not exist`);
    return user;
  }
  async getUserWithPass(id: number): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: id },
      select: ['id', 'name', 'password', 'email', 'role'],
    });
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
          userDto.contractor,
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

    // aqui verifico que el rol sea de cliente para asignarle un tomador de seguro
    console.log('el rol del usuario es ' + editedUser.role);
    if (editedUser.role === UserRole.CLIENT) {
      console.log('contractor numero ' + updateUserDto.contractor);
      if (updateUserDto.contractor) {
        const contrator = await this.contractorService.getContractor(
          updateUserDto.contractor,
        );
        console.log(editedUser);
        editedUser.contractors = [contrator]; //solo un contractor
      }
    }
    return await this.userRepository.save(editedUser);
  }
  async updateProfile(
    id: number,
    updateProfile: EditProfileUserDto,
  ): Promise<UserEntity> {
    console.log(updateProfile);
    const user = await this.getUserWithPass(id);
    if (!(await compare(updateProfile.passwordBefore, user.password)))
      throw new UnauthorizedException('The old password is wrong');
    if (updateProfile.passwordNew1 !== updateProfile.passwordNew2)
      throw new UnauthorizedException('The passwords do not match');
    user.password = updateProfile.passwordNew1;
    console.log(user); //aqui
    const profiel = await this.userRepository.save(user);
    delete profiel.password;
    return profiel;
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
