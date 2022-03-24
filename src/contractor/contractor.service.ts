import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateContratorDto } from './dto/create-contrator.dto';
import { UpdateContratorDto } from './dto/update-contrator.dto';
import { ContratorEntity } from './entity/contrator.entity';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(ContratorEntity)
    private readonly contractRepository: Repository<ContratorEntity>,
    private userService: UserService,
  ) {}
  async getContrators(): Promise<ContratorEntity[]> {
    return await this.contractRepository.find();
  }
  async getContractor(id: number): Promise<ContratorEntity> {
    const contractor = await this.contractRepository.findOne(id);
    if (!contractor)
      throw new NotFoundException('The contractor does not exist');
    return contractor;
  }
  async createContractor(
    createContractorDto: CreateContratorDto,
    createUserDto: CreateUserDto,
  ): Promise<ContratorEntity> {
    this.userService.createUser(createUserDto);
    const contr = this.contractRepository.create(createContractorDto);
    return await this.contractRepository.save(contr);
  }
  async updateContractor(
    id: number,
    updateContractorDto: UpdateContratorDto,
  ): Promise<ContratorEntity> {
    const contractor = await this.getContractor(id);
    const editedContract = Object.assign(contractor, updateContractorDto);
    return await this.contractRepository.save(editedContract);
  }
  async deleteContractor(id: number): Promise<ContratorEntity> {
    const contractor = await this.getContractor(id);
    return await this.contractRepository.remove(contractor);
  }
}
