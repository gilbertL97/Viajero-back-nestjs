import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}
  async create(fileEntity: FileEntity): Promise<FileEntity> {
    return this.fileRepository.create(fileEntity);
  }

  async findAll(): Promise<FileEntity[]> {
    return this.fileRepository.find();
  }

  async findOne(id: number): Promise<FileEntity> {
    const file = await this.fileRepository.findOne(id);
    if (!file) throw new NotFoundException('file does not exist');
    return file;
  }

  async remove(id: number): Promise<FileEntity> {
    const file = await this.findOne(id);
    return this.fileRepository.remove(file);
  }
}
