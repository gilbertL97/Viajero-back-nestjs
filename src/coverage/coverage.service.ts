import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { CoverageEntity } from './entities/coverage.entity';

@Injectable()
export class CoverageService {
  constructor(
    @InjectRepository(CoverageEntity)
    private readonly coverageRepository: Repository<CoverageEntity>,
  ) {}

  async createCoverage(
    createCoverageDto: CreateCoverageDto,
  ): Promise<CoverageEntity> {
    const coverage = this.coverageRepository.create(createCoverageDto);
    const newCoverage = await this.coverageRepository
      .save(coverage)
      .catch(() => {
        throw new BadRequestException('duplicate name ');
      });
    return newCoverage;
  }

  async getCoverages(): Promise<CoverageEntity[]> {
    return this.coverageRepository.find();
  }

  async getCoverage(id: number): Promise<CoverageEntity> {
    const coverage = await this.coverageRepository.findOne(id);
    if (!coverage) throw new NotFoundException('doe not exist coverage');
    return coverage;
  }

  async updateCoverage(
    id: number,
    updateCoverageDto: UpdateCoverageDto,
  ): Promise<CoverageEntity> {
    const coverag = await this.getCoverage(id);
    const updatedCoverage = Object.assign(coverag, updateCoverageDto);
    return await this.coverageRepository.save(updatedCoverage);
  }

  async deleteCoverage(id: number): Promise<CoverageEntity> {
    const coverage = await this.getCoverage(id);
    return await this.coverageRepository.remove(coverage);
  }
}
