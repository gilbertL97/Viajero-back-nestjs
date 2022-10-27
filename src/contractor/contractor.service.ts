import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileHelper } from 'src/common/helper/file.helper';
import { TravelerService } from 'src/traveler/service/traveler.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
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
    @Inject(forwardRef(() => TravelerService))
    private readonly travelerService: TravelerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async getContrators(user: UserEntity): Promise<ContratorEntity[]> {
    if (user.role == UserRole.CLIENT) {
      const userC = await this.userService.getUser(user.id);
      return userC.contractors;
    }
    return await this.contractRepository.find({ relations: ['users'] });
  }

  async getContractor(id: number): Promise<ContratorEntity> {
    const contractor = await this.contractRepository.findOne({
      where: { id: id },
    });
    if (!contractor)
      throw new NotFoundException('The contractor does not exist');
    return contractor;
  }
  async getContratorsActive(): Promise<ContratorEntity[]> {
    return await this.contractRepository.find({
      relations: ['users'],
      where: { isActive: true },
    });
  }
  async getContractorWithUsers(id: number): Promise<ContratorEntity> {
    const contractor = await this.contractRepository.findOne({
      where: { id: id },
      relations: ['users'],
    });
    if (!contractor)
      throw new NotFoundException('The contractor does not exist');
    return contractor;
  }
  async createContractor(
    createContractorDto: CreateContratorDto,
  ): Promise<ContratorEntity> {
    const contractor: ContratorEntity =
      this.contractRepository.create(createContractorDto);
    const newContractor = await this.contractRepository
      .save(contractor)
      .catch(() => {
        throw new BadRequestException('duplicate name or email');
      });
    await FileHelper.createFolder(newContractor.file);
    return newContractor;
  }
  async updateContractor(
    id: number,
    updateContractorDto: UpdateContratorDto,
  ): Promise<ContratorEntity> {
    const contractor = await this.getContractor(id);
    const oldFolder = contractor.file;
    const editedContract = Object.assign(contractor, updateContractorDto);
    const contractorSaved = await this.contractRepository.save(editedContract);
    FileHelper.updateFolder(contractorSaved.file, oldFolder);
    return contractorSaved;
  }
  async deleteContractor(id: number): Promise<ContratorEntity> {
    const contractor = await this.getContractorWithUsers(id);
    const traveler = await this.travelerService.findOneTravelerWithContractor(
      contractor,
    );
    console.log(traveler);
    if (!traveler) {
      const deleted = await this.contractRepository.remove(contractor);
      FileHelper.deletFolder(deleted.file);
      return deleted;
    }
    contractor.isActive = false;
    await this.contractRepository.save(contractor);
    throw new ConflictException('cant delete the Contractor');
  }
}
