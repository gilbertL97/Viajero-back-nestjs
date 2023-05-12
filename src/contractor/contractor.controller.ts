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
  Res,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';

import { ContractorService } from './service/contractor.service';
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
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.CLIENT)
  @Get('/active')
  async getContractsActive(): Promise<ContratorEntity[]> {
    const data = this.contractService.getContratorsActive();
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.CLIENT)
  @Get('/excel')
  async getContractExcel(@GetUser() user: UserEntity, @Res() res) {
    const buffer = await this.contractService.exportAllContractorExcel(user);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Dispotition': 'attachment;filename= Archivos.xlsx',
      'Content-Lenght': buffer.byteLength,
    });
    res.end(buffer);
  }
  @Get('/pdf')
  async exportContractorPdf(
    @GetUser() user: UserEntity,
    @Res() res,
  ): Promise<void> {
    const buffer = await this.contractService.exportAllContractorPdf(user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;Coberturas.pdf',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
  @Get('/invoicing')
  async getFacturation(
    @Query() filter: FilterContractorDto,
    @GetUser() user: UserEntity,
  ): Promise<any> {
    const { dateInvoicing } = filter;
    return await this.contractService.getInvoicing(dateInvoicing, user);
  }
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
  @Get('/invoicing/excel')
  async getFacturationExcel(
    @Query() filter: FilterContractorDto,
    @GetUser() user: UserEntity,
    @Res() res,
  ): Promise<any> {
    const { dateInvoicing } = filter;
    console.log(filter);
    const buffer = await this.contractService.exportInvoicingExcel(
      dateInvoicing,
      user,
    );
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Dispotition': 'attachment;filename= Archivos.xlsx',
      'Content-Lenght': buffer.byteLength,
    });
    res.end(buffer);
  }
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
  @Get('/invoicing/pdf')
  async getFacturationPdf(
    @Query() filter: FilterContractorDto,
    @GetUser() user: UserEntity,
    @Res() res,
  ): Promise<void> {
    const { dateInvoicing } = filter;
    const buffer = await this.contractService.exportInvoicingPdf(
      dateInvoicing,
      user,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;Coberturas.pdf',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
  @Get('/detailed')
  async getDetailedContract(
    @Query() filter: FilterContractorDto,
    @GetUser() user: UserEntity,
  ): Promise<any> {
    return await this.contractService.getDetailedContract(filter, user);
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
  @Get('/detailed/excel')
  async getDetailedContractExcel(
    @Query() filter: FilterContractorDto,
    @GetUser() user: UserEntity,
    @Res() res,
  ): Promise<any> {
    const buffer = await this.contractService.exportDetailedExxcel(
      filter,
      user,
    );
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Dispotition': 'attachment;filename= Archivos.xlsx',
      'Content-Lenght': buffer.byteLength,
    });
    res.end(buffer);
  }
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
  @Get('/detailed/pdf')
  async getDetailedContractPdf(
    @Query() filter: FilterContractorDto,
    @GetUser() user: UserEntity,
    @Res() res,
  ): Promise<void> {
    const { dateInvoicing } = filter;
    const buffer = await this.contractService.exportInvoicingPdf(
      dateInvoicing,
      user,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;Coberturas.pdf',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
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
