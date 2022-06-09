import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';

@Controller('coverage')
export class CoverageController {
  constructor(private readonly coverageService: CoverageService) {}

  @Post()
  async create(@Body() createCoverageDto: CreateCoverageDto) {
    return this.coverageService.createCoverage(createCoverageDto);
  }

  @Get()
  async findAll() {
    return this.coverageService.getCoverages();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.coverageService.getCoverage(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCoverageDto: UpdateCoverageDto,
  ) {
    return this.coverageService.updateCoverage(id, updateCoverageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.coverageService.deleteCoverage(id);
  }
}
