import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelerService } from 'src/traveler/traveler.service';
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
  ) {}
  async getContrators(): Promise<ContratorEntity[]> {
    return await this.contractRepository.find({ relations: ['users'] });
  }

  async getContractor(id: number): Promise<ContratorEntity> {
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
    return newContractor;
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
    const traveler = await this.travelerService.findOneTravelerWithContractor(
      contractor,
    );
    console.log(traveler);
    if (!traveler) return this.contractRepository.remove(contractor);
    contractor.active = false;
    await this.contractRepository.save(contractor);
    throw new ConflictException('cant delete the Contractor');
  }
}
