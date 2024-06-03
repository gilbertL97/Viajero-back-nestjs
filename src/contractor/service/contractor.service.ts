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
import { LogginService } from 'src/loggin/loggin.service';

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
    private readonly contratctorExportService: ContractorExportService,
    private readonly loggingService: LogginService,
  ) {}
  async getContrators(user: UserEntity): Promise<ContratorEntity[]> {
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT) {
      const userC = await this.userService.getUser(user.id);
      await this.log(`Obteniendo  el contratante del Usuario actual`);
      return userC.contractors;
    }
    await this.log(`Obteniendo contratantes`);
    return await this.contractRepository.find(); //aqui elimine todos los usuarios
  }

  async getAllContrators(): Promise<ContratorEntity[]> {
    await this.log(`Obteniendo contratantes`);
    return await this.contractRepository.find();
  }
  async getContractor(id: number): Promise<ContratorEntity> {
    const contractor = await this.contractRepository.findOne({
      where: { id: id },
    });
    if (!contractor)
      throw new NotFoundException('The contractor does not exist');
    await this.log(`Obteniendo el contratantes con id ${contractor.id}`);
    return contractor;
  }
  async getContratorsActive(): Promise<ContratorEntity[]> {
    await this.log(`Obteniendo los contratante activos`);
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
    await this.log(`Obteniendo los contratante con usuarios`);
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
    await this.log(`Creando un contratante`);
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
    await this.log(`Actualizando un contratante`);
    //FileHelper.updateFolder('contractor', contractorSaved.file, oldFolder);
    return contractorSaved;
  }
  async deleteContractor(id: number): Promise<ContratorEntity> {
    const contractor = await this.getContractorWithUsers(id);
    const traveler =
      await this.travelerService.findOneTravelerWithContractor(contractor);
    // console.log(traveler);
    //si no tiene viajeros se elimina
    if (!traveler) {
      const deleted = await this.contractRepository.remove(contractor);
      await this.log(`Eliminando un contratante`);
      //FileHelper.deletFolder('contractor', deleted.file);
      return deleted;
    }
    //si tiene viajeros no se elimina se desactiva y
    contractor.isActive = false;
    //se desactivan los usuarios de ese client
    await this.userService.disableUser(contractor.users);
    await this.contractRepository.save(contractor);
    await this.log(`Intentando eliminar un contratante`);
    throw new ConflictException('cant delete the Contractor');
  }
  async getInvoicing(date: Date, user: UserEntity): Promise<any> {
    let id = undefined;
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT)
      id = (await this.userService.getUser(user.id)).contractors[0].id;
    await this.log(`Obteniendo la facturacion mensual`);
    return await this.contractRepository.getInvoicingOfMonth(date, id);
  }
  async getDetailedContract(
    filter: FilterContractorDto,
    user: UserEntity,
  ): Promise<ContratorEntity[]> {
    let id = undefined;
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT)
      id = (await this.userService.getUser(user.id)).contractors[0].id;
    await this.log(`Obteniendo la Facturacion detallada`);
    return await this.contractRepository.getDetailedTravelers(filter, id);
  }
  async getPolicyOverview(
    filter: FilterContractorDto,
    user: UserEntity,
  ): Promise<any> {
    let id = undefined;
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT)
      id = (await this.userService.getUser(user.id)).contractors[0].id;
    await this.log(`Obteniendo el resumen de Polizas`);
    return this.contractRepository.policyOverview(filter, id);
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
    return this.contratctorExportService.exportPdfInvoicing(data, date);
  }
  async exportDetailedPdf(filter: FilterContractorDto, user: UserEntity) {
    const data = await this.getDetailedContract(filter, user);
    return this.contratctorExportService.exportPdfDetailedContract(data);
  }
  async exportPolicyOverviewPdf(filter: FilterContractorDto, user: UserEntity) {
    const data = await this.getPolicyOverview(filter, user);
    return this.contratctorExportService.exportPdfPolicyOverview(data, filter);
  }
  async exportPolicyOverviewExcel(
    filter: FilterContractorDto,
    user: UserEntity,
  ) {
    const data = await this.getPolicyOverview(filter, user);
    return this.contratctorExportService.exportExcelPolicyOverview(data);
  }
  async log(message: string, level = 'info') {
    await this.loggingService.create({
      message,
      context: 'Coverage Service',
      level,
      createdAt: new Date().toISOString(),
    });
  }
}
