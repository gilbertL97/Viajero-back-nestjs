import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exportExcel } from 'src/common/helper/export/exportExcel';

//import { FileHelper } from 'src/common/helper/file.helper';
import { TravelerService } from 'src/traveler/service/traveler.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
import { UserService } from 'src/user/user.service';
import { CreateContratorDto } from './dto/create-contrator.dto';
import { UpdateContratorDto } from './dto/update-contrator.dto';
import { ContratorEntity } from './entity/contrator.entity';
import { ContractorRepository } from './repository/contractor.repository';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(ContractorRepository)
    private readonly contractRepository: ContractorRepository,
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
    return await this.contractRepository.find(); //aqui elimine todos los usuarios
  }

  async getAllContrators(): Promise<ContratorEntity[]> {
    return await this.contractRepository.find();
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
    // await FileHelper.createFolder('contractor', newContractor.file);
    return newContractor;
  }
  async updateContractor(
    id: number,
    updateContractorDto: UpdateContratorDto,
  ): Promise<ContratorEntity> {
    const contractor = await this.getContractor(id);
    //const oldFolder = contractor.file;
    const editedContract = Object.assign(contractor, updateContractorDto);
    const contractorSaved = await this.contractRepository.save(editedContract);
    //FileHelper.updateFolder('contractor', contractorSaved.file, oldFolder);
    return contractorSaved;
  }
  async deleteContractor(id: number): Promise<ContratorEntity> {
    const contractor = await this.getContractorWithUsers(id);
    const traveler = await this.travelerService.findOneTravelerWithContractor(
      contractor,
    );
    // console.log(traveler);
    if (!traveler) {
      const deleted = await this.contractRepository.remove(contractor);
      //FileHelper.deletFolder('contractor', deleted.file);
      return deleted;
    }
    contractor.isActive = false;
    await this.contractRepository.save(contractor);
    throw new ConflictException('cant delete the Contractor');
  }
  async getInvoicing(date: Date, user: UserEntity): Promise<any> {
    let id = undefined;
    if (user.role == UserRole.CLIENT)
      id = (await this.userService.getUser(user.id)).contractors[0].id;
    return await this.contractRepository.getInvoicingOfMonth(date, id);
  }
  async getDetailedContract(date: Date, user: UserEntity): Promise<any> {
    let id = undefined;
    if (user.role == UserRole.CLIENT)
      id = (await this.userService.getUser(user.id)).contractors[0].id;
    return await this.contractRepository.getDetailedTravelers(date, id);
  }
  async exportExcel(contractor: ContratorEntity[]) {
    const columns = [
      { key: 'client', header: 'Nombre' },
      {
        key: 'poliza',
        header: 'Poliza',
      },
      {
        key: 'total_amount, ',
        header: 'Correo',
      },
      {
        key: 'telf',
        header: 'Telefono',
      },
      {
        key: 'file',
        header: 'Carpeta',
      },
      {
        key: 'isActive',
        header: 'Estado',
      },
    ];
    return exportExcel(contractor, columns, 'Clientes');
  }

  async exportExcelInvoicing(contractor: any) {
    const { total_amount, total_travelers } = contractor;
    const total = {
      client: 'Total',
      poliza: '-',
      total_travelers: total_travelers,
      total_import: total_amount,
    };
    contractor.contractors.push(total);
    const columns = [
      { key: 'client', header: 'Nombre' },
      {
        key: 'poliza',
        header: 'Poliza',
      },
      {
        key: 'total_travelers',
        header: 'Total de Viajeros',
      },
      {
        key: 'total_import',
        header: 'Importe',
      },
    ];
    return exportExcel(contractor.contractors, columns, 'Clientes');
  }
}
