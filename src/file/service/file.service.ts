import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exportExcel } from 'src/common/export/exportExcel';
import { exportPdf } from 'src/common/export/exportPdf';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
import { UserService } from 'src/user/user.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilterFileDto } from '../dto/filter-file.dto';
import { FileEntity } from '../entities/file.entity';
import { paginate } from 'src/common/pagination/service/pagination.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { Configuration } from 'src/config/config.const';
import { LogginService } from 'src/loggin/loggin.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity, Configuration.POSTGRESCONNECT)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly userService: UserService,
    private readonly loggingService: LogginService,
  ) {}
  async create(
    name: string,
    client: ContratorEntity,
    user: UserEntity,
  ): Promise<FileEntity> {
    const file = new FileEntity();
    file.user = user;
    file.name = name;
    file.contractor = client;
    this.log(`Insertando archivo`);
    return await this.fileRepository.save(file);
  }

  async findAll(user: UserEntity): Promise<FileEntity[]> {
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT) {
      const userC = await this.userService.getUser(user.id);
      this.log(`Obteniendo archivos del Contratante del Usuario ${userC.id}`);
      return this.fileRepository.find({
        where: { contractor: userC.contractors[0] },
        relations: ['contractor', 'user'],
      });
    }
    this.log(`Obteniendo archivos`);
    return this.fileRepository.find({
      relations: ['contractor', 'user'],
    });
  }

  async findOne(id: number): Promise<FileEntity> {
    const file: FileEntity = await this.fileRepository.findOne({
      where: { id: id },
      relations: ['travelers', 'contractor'],
    });
    if (!file) throw new NotFoundException('file does not exist');
    this.log(
      `Obteniendo el archivo ${file.name} del Contratante ${file.contractor.client}`,
    );
    return file;
  }

  async findOneFile(id: number, user: UserEntity): Promise<FileEntity> {
    let contractorid: number;
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT) {
      contractorid = await (
        await this.userService.getUser(user.id)
      ).contractors[0].id;
    }
    const file = await this.fileRepository.findOne({
      where: { id: id, contractor: { id: contractorid } },
      relations: ['travelers'],
    });
    if (!file) throw new NotFoundException('file does not exist');
    this.log(
      `Obteniendo el archivo ${id} del Contratante ${file.contractor.id}`,
    );
    return file;
  }
  async findByName(name: string): Promise<FileEntity> {
    this.log(`Obteniendo el archivo ${name} por nombre`);
    const file = await this.fileRepository.findOne({
      where: { name: name },
    });
    if (!file) throw new NotFoundException('file does not exist');
    return file;
  }
  async remove(id: number): Promise<FileEntity> {
    const file = await this.findOne(id);
    /* if (file.travelers.length > 0 && !confirm)
      throw new ConflictException(file.travelers.length);*/
    this.log(`eliminando el archvo ${file.name}`);
    return this.fileRepository.remove(file);
  }
  async filterFileQuery(
    file: FilterFileDto,
    user: UserEntity,
  ): Promise<SelectQueryBuilder<FileEntity>> {
    this.log(`Obteniendo archivos filtrados y paginados`);
    let contractor = file.contractor;

    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT) {
      const userC = await this.userService.getUser(user.id);
      contractor = userC.contractors[0].id;
    }

    const query = this.fileRepository.createQueryBuilder('files');
    const { end_date_create, start_date_create, name } = file;

    if (contractor)
      query.where('files.contractor =:contractor', { contractor });
    if (end_date_create)
      query.andWhere('files.created_at<=:end_date_create', { end_date_create });
    if (start_date_create)
      query.andWhere('files.created_at>=:start_date_create', {
        start_date_create,
      });
    query.leftJoinAndSelect('files.contractor', 'contractor');
    query.leftJoinAndSelect('files.user', 'user');
    if (name) {
      query.andWhere('files.name =:name', { name });
    }
    return query;
  }
  async getFilePaginatedAndFiltered(
    file: FilterFileDto,
    user: UserEntity,
    pag: PaginationDto,
  ) {
    return await paginate(await this.filterFileQuery(file, user), pag);
  }
  async getFileFiltered(file: FilterFileDto, user: UserEntity) {
    return await (await this.filterFileQuery(file, user)).getMany();
  }
  exporToExcel(files: FileEntity[]) {
    const columns = [
      { key: 'name', header: 'Nombre' },
      {
        key: 'contractor',
        header: 'Cliente',
      },
      {
        key: 'created_at',
        header: 'Fecha de Importacion',
        style: { numFmt: 'dd/mm/yyyy' },
      },
      {
        key: 'user',
        header: 'Usuario',
      },
    ];
    this.log(`Exportando archivos a excel`);
    return exportExcel(files, columns, 'Archivos');
  }
  exporToPdf(files: FileEntity[]) {
    const columns = [
      { property: 'name', label: 'Nombre', width: 200 },
      {
        property: 'contractor',
        label: 'Cliente',
        width: 200,
      },
      {
        property: 'created_at',
        label: 'Fecha de Importacion',
        width: 90,
      },
      {
        property: 'user',
        label: 'Usuario',
        width: 90,
      },
    ];
    this.log(`Exportando archivos a Pdf`);
    return exportPdf(files, columns, 'Archivos');
  }
  log(message: string, level = 'info') {
    this.loggingService.create({
      message,
      context: 'File Service',
      level,
      createdAt: new Date().toISOString(),
    });
  }
}
