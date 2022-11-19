import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileHelper } from 'src/common/file/file.helper';
import { join } from 'path';
import * as fs from 'fs';
import { TravelerService } from 'src/traveler/service/traveler.service';
import { Repository } from 'typeorm';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { CoverageEntity } from './entities/coverage.entity';

@Injectable()
export class CoverageService {
  constructor(
    @InjectRepository(CoverageEntity)
    private readonly coverageRepository: Repository<CoverageEntity>,
    @Inject(forwardRef(() => TravelerService))
    private readonly travelerService: TravelerService,
  ) {}

  async createCoverage(
    createCoverageDto: CreateCoverageDto,
    file: Express.Multer.File,
  ): Promise<CoverageEntity> {
    const coverage = this.coverageRepository.create(createCoverageDto);
     if(file)coverage.benefitTable=file.filename;
    const newCoverage = await this.coverageRepository
      .save(coverage)
      .catch(() => {
        if(coverage.benefitTable)FileHelper.deletFile(join(FileHelper.uploadsPath,coverage.benefitTable));
        throw new BadRequestException('duplicate Name or File');
      });
  if(newCoverage.benefitTable) FileHelper.moveFile(join(FileHelper.uploadsPath,'coverages',newCoverage.benefitTable),join(FileHelper.uploadsPath,newCoverage.benefitTable));
    return newCoverage;
  }

  async getCoverages(): Promise<CoverageEntity[]> {
    return this.coverageRepository.find();
  }
  async getCoveragesActives(): Promise<CoverageEntity[]> {
    return this.coverageRepository.find({ where: { isActive: true } });
  }
  async getCoverage(id: number): Promise<CoverageEntity> {
    const coverage = await this.coverageRepository.findOne({
      where: { id: id },
    });
    if (!coverage) throw new NotFoundException('does not exist coverage');
    return coverage;
  }

  async updateCoverage(
    id: number,
    updateCoverageDto: UpdateCoverageDto,
    file: Express.Multer.File,
  ): Promise<CoverageEntity> {
    const coverag = await this.getCoverage(id);
    const fileBefore=coverag.benefitTable;
    const updatedCoverage = Object.assign(coverag, updateCoverageDto);
    if(file)updatedCoverage.benefitTable=file.filename;
    const coverageSaved = await this.coverageRepository.save(updatedCoverage).catch(() => {
      if(file)FileHelper.deletFile(join(FileHelper.uploadsPath,file.filename));
      throw new BadRequestException('duplicate Name or File');
    });;
    if(file){ 
      if(fileBefore)
        FileHelper.deletFile(join(FileHelper.uploadsPath,'coverages',fileBefore));
      FileHelper.moveFile(join(FileHelper.uploadsPath,'coverages',file.filename),join(FileHelper.uploadsPath,file.filename));
    }
     return coverageSaved;
  }

  async deleteCoverage(id: number): Promise<CoverageEntity> {
    const coverage = await this.getCoverage(id);
    const traveler = await this.travelerService.findOneTravelerWithCoverage(
      coverage,
    );
    if (!traveler) {
      const deletedCoverage = await this.coverageRepository.remove(coverage);
      if(deletedCoverage.benefitTable)FileHelper.deletFile(join(FileHelper.uploadsPath,'coverages',deletedCoverage.benefitTable));     
      return deletedCoverage;
    }
    coverage.isActive = false;
    await this.coverageRepository.save(coverage);
    throw new ConflictException('cant delete the Coverage');
  }
}
