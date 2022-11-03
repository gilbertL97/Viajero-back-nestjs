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
  ): Promise<CoverageEntity> {
    const coverage = this.coverageRepository.create(createCoverageDto);
    const newCoverage = await this.coverageRepository
      .save(coverage)
      .catch(() => {
        throw new BadRequestException('duplicate name ');
      });
    //FileHelper.createFolder('coverage', newCoverage.folder);
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
  ): Promise<CoverageEntity> {
    const coverag = await this.getCoverage(id);
    const updatedCoverage = Object.assign(coverag, updateCoverageDto);
    const coverageSaved = await this.coverageRepository.save(updatedCoverage);
    //FileHelper.updateFolder('coverage', coverageSaved.folder, coverag.folder);
    return coverageSaved;
  }

  async deleteCoverage(id: number): Promise<CoverageEntity> {
    const coverage = await this.getCoverage(id);
    const traveler = await this.travelerService.findOneTravelerWithCoverage(
      coverage,
    );
    if (!traveler) {
      const deletedCoverage = await this.coverageRepository.remove(coverage);
      //FileHelper.deletFolder('coverage', deletedCoverage.folder);
      return deletedCoverage;
    }
    coverage.isActive = false;
    await this.coverageRepository.save(coverage);
    throw new ConflictException('cant delete the Coverage');
  }
}
