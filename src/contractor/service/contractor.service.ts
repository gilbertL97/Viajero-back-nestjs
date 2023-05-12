import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exportExcel } from 'src/common/export/exportExcel';
import { exportPdf } from 'src/common/export/exportPdf';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { TravelerEntity } from 'src/traveler/entity/traveler.entity';

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
  async getDetailedContract(
    filter: FilterContractorDto,
    user: UserEntity,
  ): Promise<ContratorEntity[]> {
    let id = undefined;
    if (user.role == UserRole.CLIENT)
      id = (await this.userService.getUser(user.id)).contractors[0].id;
    else id = filter.id;
    return await this.contractRepository.getDetailedTravelers(
      filter.dateInvoicing,
      id,
    );
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
  exportExcelDetailedContract(data: ContratorEntity[]) {
    let allTravelers = [];
    data.map((contractor) => {
      allTravelers = allTravelers.concat(contractor.travelers);
    });

    const columns = [
      { key: 'name', header: 'Nombre' },
      {
        key: 'contractor',
        header: 'Cliente',
      },
      { key: 'sex', header: 'Sexo' },
      { key: 'born_date', header: 'Fecha de Nacimiento' },
      { key: 'email', header: 'Correo' },

      { key: 'passport', header: 'Pasaporte' },

      { key: 'flight', header: 'Vuelo' },
      { key: 'sale_date', header: 'Fecha de Venta' },

      { key: 'start_date', header: 'Fecha de Inicio' },

      { key: 'end_date_policy', header: 'Fecha de Fin de Viaje' },

      {
        key: 'number_high_risk_days',
        header: 'Numero de dias Alto Riesgo',
      },

      { key: 'number_days', header: 'Cantidad de Dias', type: 'number' },

      {
        key: 'amount_days_high_risk',
        header: 'Monto de dias de alto riesgo',
      },

      {
        key: 'amount_days_covered',
        header: 'Monto de dias cubiertos',
      },

      { key: 'total_amount', header: 'Monto total' },

      { key: 'state', header: 'Estado' },

      { key: 'contractor', header: 'Cliente' },

      { key: 'origin_country', header: 'Pais origen' },

      { key: 'file', header: 'Fichero' },

      { key: 'nationality', header: 'Nacionalidad' },

      { key: 'coverage', header: 'Cobertura' },
    ];
    console.log(allTravelers, data);
    return exportExcel(allTravelers, columns, 'Viajeros por Cliente');
  }
  exportToPdf(coverage: CoverageEntity[]) {
    const columns = [
      { label: 'Nombre', property: 'name', width: 100 },
      {
        label: 'Precio',
        property: 'price',
        width: 40,
      },
      {
        label: 'Diario',
        property: 'daily',
        width: 60,
        align: 'center',
      },
      {
        label: 'Alto Riesgo',
        property: 'high_risk',
        width: 50,
        align: 'center',
      },
      {
        label: 'Cant de dias',
        property: 'number_of_days',
        width: 60,
        align: 'center',
      },
      {
        label: 'Activo',
        property: 'isActive',
        width: 50,
        align: 'center',
      },
      {
        label: 'Cadena de Configuracion',
        property: 'config_string',
        width: 100,
      },
    ];
    return exportPdf(coverage, columns, 'Cobertura');
  }
}
