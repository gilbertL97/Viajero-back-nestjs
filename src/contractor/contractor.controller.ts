import { Controller, Get } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContratorEntity } from './entity/contrator.entity';

@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractService: ContractorService) {}

  @Get()
  async getContracts(): Promise<ContratorEntity[]> {
    return this.contractService.getContrators();
  }
}
