import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exportExcel } from 'src/common/export/exportExcel';
import { exportPdf } from 'src/common/export/exportPdf';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { FilterFileDto } from './dto/filter-file.dto';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly userService: UserService,
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

    return await this.fileRepository.save(file);
  }

  async findAll(user: UserEntity): Promise<FileEntity[]> {
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT) {
      const userC = await this.userService.getUser(user.id);
      return this.fileRepository.find({
        where: { contractor: userC.contractors[0] },
        relations: ['contractor', 'user'],
      });
    }
    return this.fileRepository.find({
      relations: ['contractor', 'user'],
    });
  }

  async findOne(id: number): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { id: id },
      relations: ['travelers'],
    });
    if (!file) throw new NotFoundException('file does not exist');
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
      where: { id: id, contractor: contractorid },
      relations: ['travelers'],
    });
    if (!file) throw new NotFoundException('file does not exist');
    return file;
  }
  async findByName(name: string): Promise<FileEntity> {
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
    return this.fileRepository.remove(file);
  }
  async filterFile(
    file: FilterFileDto,
    user: UserEntity,
  ): Promise<FileEntity[]> {
    let contractor = file.contractor;

    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT) {
      const userC = await this.userService.getUser(user.id);
      contractor = userC.contractors[0].id;
    }

    const query = this.fileRepository.createQueryBuilder('files');
    const { end_date_create, start_date_create } = file;

    if (contractor)
      query.where('files.contractor =:contractor', { contractor });
    if (end_date_create)
      query.andWhere('files.created_at<:end_date_create', { end_date_create });
    if (start_date_create)
      query.andWhere('files.created_at>:start_date_create', {
        start_date_create,
      });
    query.leftJoinAndSelect('files.contractor', 'contractor');
    query.leftJoinAndSelect('files.user', 'user');
    return query.getMany();
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
    return exportPdf(files, columns, 'Archivos');
  }
}
