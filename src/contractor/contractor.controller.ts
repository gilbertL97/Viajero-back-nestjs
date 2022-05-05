import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ContractorService } from './contractor.service';
import { CreateContratorDto } from './dto/create-contrator.dto';
import { ContratorEntity } from './entity/contrator.entity';

@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractService: ContractorService) {}

  @Get()
  async getContracts(): Promise<ContratorEntity[]> {
    return this.contractService.getContrators();
  }
  /* @Post()
  async createContract(
    @Body() createContractor: CreateContratorDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.contractService.createContractor(
      createContractor,
      createUserDto,
    );
  }*/
}
