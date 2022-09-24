import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ContractorService } from './contractor.service';
import { CreateContratorDto } from './dto/create-contrator.dto';
import { UpdateContratorDto } from './dto/update-contrator.dto';
import { ContratorEntity } from './entity/contrator.entity';

@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractService: ContractorService) {}

  @Get()
  async getContracts(): Promise<ContratorEntity[]> {
    const data = this.contractService.getContrators();
    return data;
  }
   @Get('/active')
  async getContractsActive(): Promise<ContratorEntity[]> {
    const data = this.contractService.getContratorsActive();
    return data;
  }
  @Get(':id')
  getContract(@Param('id', ParseIntPipe) id: number): Promise<ContratorEntity> {
    const data = this.contractService.getContractor(id);
    return data;
  }
  @Post()
  createContract(
    @Body() createContractor: CreateContratorDto,
  ): Promise<ContratorEntity> {
    const data = this.contractService.createContractor(createContractor);
    return data;
  }

  @Patch(':id')
  async updateContract(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContratDto: UpdateContratorDto,
  ): Promise<ContratorEntity> {
    const data = this.contractService.updateContractor(id, updateContratDto);
    return data;
  }
  @Delete(':id')
  async deletContract(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContratorEntity> {
    const data = this.contractService.deleteContractor(id);
    return data;
  }
}
