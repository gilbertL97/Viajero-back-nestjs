import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';

import { ContractorService } from './contractor.service';
import { ContractorResponseDto } from './dto/contractor-response.dto';
import { CreateContratorDto } from './dto/create-contrator.dto';
import { FilterContractorDto } from './dto/filter-contractor.dto';
import { UpdateContratorDto } from './dto/update-contrator.dto';
import { ContratorEntity } from './entity/contrator.entity';

@UseGuards(JwtAuthGuard)
@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractService: ContractorService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.CLIENT)
  @Get()
  async getContracts(@GetUser() user: UserEntity): Promise<ContratorEntity[]> {
    const data = this.contractService.getContrators(user);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get('/active')
  async getContractsActive(): Promise<ContratorEntity[]> {
    const data = this.contractService.getContratorsActive();
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get('/invoicing')
  async getFacturation(
    @Query() filter: FilterContractorDto,
  ): Promise<ContractorResponseDto[]> {
    return await this.contractService.getInvoicing(filter.dateInvoicing);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get(':id')
  getContract(@Param('id', ParseIntPipe) id: number): Promise<ContratorEntity> {
    const data = this.contractService.getContractor(id);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Post()
  createContract(
    @Body() createContractor: CreateContratorDto,
  ): Promise<ContratorEntity> {
    const data = this.contractService.createContractor(createContractor);
    return data;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Patch(':id')
  async updateContract(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContratDto: UpdateContratorDto,
  ): Promise<ContratorEntity> {
    const data = this.contractService.updateContractor(id, updateContratDto);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Delete(':id')
  async deletContract(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContratorEntity> {
    const data = this.contractService.deleteContractor(id);
    return data;
  }
}
