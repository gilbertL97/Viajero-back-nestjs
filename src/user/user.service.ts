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
import { ContractorService } from 'src/contractor/service/contractor.service';
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
    if (
      userDto.role == UserRole.CLIENT ||
      userDto.role == UserRole.CONSULTAGENT
    ) {
      if (userDto.contractor) {
        const contrator = await this.contractorService.getContractor(
          userDto.contractor,
        );
        user.contractors = [contrator];
      }
    } else delete userDto.contractor;
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
    if (
      editedUser.role == UserRole.CLIENT ||
      editedUser.role == UserRole.CONSULTAGENT
    ) {
      if (updateUserDto.contractor) {
        const contrator = await this.contractorService.getContractor(
          updateUserDto.contractor,
        );
        editedUser.contractors = [contrator]; //solo un contractor
        delete editedUser.contractor;
      }
    } else delete updateUserDto.contractor;
    return await this.userRepository.save(editedUser);
  }
  async updateProfile(
    id: number,
    updateProfile: EditProfileUserDto,
  ): Promise<UserEntity> {
    const user = await this.getUserWithPass(id);
    if (!(await compare(updateProfile.passwordBefore, user.password)))
      throw new UnauthorizedException('The old password is wrong');
    if (updateProfile.passwordNew1 !== updateProfile.passwordNew2)
      throw new UnauthorizedException('The passwords do not match');
    user.password = updateProfile.passwordNew1;
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
    const newUser = await this.userRepository.save(user).catch(() => {
      throw new BadRequestException('Fail save contractor');
    });
    return newUser;
  }
  async updateRefreshToken(id: number, token: string) {
    const user = await this.getUser(id);
    user.refresh_token = token;
    return (await this.userRepository.save(user)).refresh_token;
  }
  async getToken(id: number) {
    return await this.userRepository.findOne(id, {
      select: ['refresh_token', 'name', 'role', 'id'],
    });
  }
  /*async deleteMultiple(id: number[]): Promise<void> {
  
    const users: UserEntity[]= id.filter(await this.getUser)
    });
  
  await this.userRepository.remove(users);*/
}
