import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import { FileHelper } from 'src/common/helper/file.helper';
import { TravelerService } from 'src/traveler/service/traveler.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
import { UserService } from 'src/user/user.service';
import { CreateContratorDto } from '../dto/create-contrator.dto';
import { FilterContractorDto } from '../dto/filter-contractor.dto';
import { UpdateContratorDto } from '../dto/update-contrator.dto';
import { ContratorEntity } from '../entity/contrator.entity';
import { ContractorRepository } from '../repository/contractor.repository';
import { ContractorExportService } from './contractorExport.service';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(ContractorRepository)
    private readonly contractRepository: ContractorRepository,
    @Inject(forwardRef(() => TravelerService))
    private readonly travelerService: TravelerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(ContractorExportService)
    private readonly contratctorExportService,
  ) {}
  async getContrators(user: UserEntity): Promise<ContratorEntity[]> {
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT) {
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
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT)
      id = (await this.userService.getUser(user.id)).contractors[0].id;
    return await this.contractRepository.getInvoicingOfMonth(date, id);
  }
  async getDetailedContract(
    filter: FilterContractorDto,
    user: UserEntity,
  ): Promise<ContratorEntity[]> {
    let id = undefined;
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT)
      id = (await this.userService.getUser(user.id)).contractors[0].id;
    return await this.contractRepository.getDetailedTravelers(filter, id);
  }
  async exportAllContractorExcel(user: UserEntity) {
    const data = await this.getContrators(user);
    return this.contratctorExportService.exportExcel(data);
  }
  async exportInvoicingExcel(date: Date, user: UserEntity) {
    const data = await this.getInvoicing(date, user);
    return this.contratctorExportService.exportExcelInvoicing(data);
  }
  async exportDetailedExxcel(filter: FilterContractorDto, user: UserEntity) {
    const data = await this.getDetailedContract(filter, user);
    return this.contratctorExportService.exportExcelDetailedContract(data);
  }
  async exportAllContractorPdf(user: UserEntity) {
    const data = await this.getContrators(user);
    return this.contratctorExportService.exportAllContractorToPdf(data);
  }
  async exportInvoicingPdf(date: Date, user: UserEntity) {
    const data = await this.getInvoicing(date, user);
    return this.contratctorExportService.exportPdfInvoicing(data);
  }
  async exportDetailedPdf(filter: FilterContractorDto, user: UserEntity) {
    const data = await this.getDetailedContract(filter, user);
    return this.contratctorExportService.exportPdfDetailedContract(data);
  }
}
