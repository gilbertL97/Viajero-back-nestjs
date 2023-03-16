import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { TravelerEntity } from 'src/traveler/entity/traveler.entity';
import { Repository } from 'typeorm';
import { FilterFileDto } from './dto/filter-file.dto';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}
  async create(name: string, client: ContratorEntity): Promise<FileEntity> {
    const file = new FileEntity();
    file.name = name;
    file.contractor = client;
    return this.fileRepository.save(file);
  }

  async findAll(): Promise<FileEntity[]> {
    return this.fileRepository.find({
      relations: ['travelers'],
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

  async remove(id: number): Promise<FileEntity> {
    const file = await this.findOne(id);
    console.log(file.travelers);
    if (file.travelers.length > 0)
      throw new BadRequestException(
        'NO se puede borrar el archivo contiene viajeros',
      );
    return this.fileRepository.remove(file);
  }
  async filterFile(file: FilterFileDto): Promise<FileEntity[]> {
    const query = this.fileRepository.createQueryBuilder('files');
    const { contractor, end_date_create, start_date_create } = file;
    if (contractor)
      query.where('files.contractor =:contractor', { contractor });
    if (end_date_create)
      query.andWhere('files.created_at<:end_date_create', { end_date_create });
    if (start_date_create)
      query.andWhere('files.created_at>:end_date_create', {
        start_date_create,
      });
    return query.getMany();
  }
}
