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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Contratantes')
@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractService: ContractorService) {}
  @ApiOperation({ summary: 'Devuelve todos los contratantes' })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
  @Get()
  async getContracts(@GetUser() user: UserEntity): Promise<ContratorEntity[]> {
    const data = this.contractService.getContrators(user);
    return data;
  }
  @ApiOperation({ summary: 'Devuelve todos los contratantes activos' })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
  @Get('/active')
  async getContractsActive(): Promise<ContratorEntity[]> {
    const data = this.contractService.getContratorsActive();
    return data;
  }
  @ApiOperation({ summary: 'Devuelve un excel con todos los contratantes' })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
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
  @ApiOperation({ summary: 'Devuelve un pdf los contratantes ' })
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
  )
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
  @ApiOperation({ summary: 'Devuelve devuelve la facturacion mensual' })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
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
    UserRole.CONSULTAGENT,
  )
  @Get('/detailed')
  async getDetailedContract(
    @Query() filter: FilterContractorDto,
    @GetUser() user: UserEntity,
  ): Promise<any> {
    console.log(filter);
    return await this.contractService.getDetailedContract(filter, user);
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
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
    UserRole.CONSULTAGENT,
  )
  @Get('/detailed/pdf')
  async getDetailedContractPdf(
    @Query() filter: FilterContractorDto,
    @GetUser() user: UserEntity,
    @Res() res,
  ): Promise<void> {
    const buffer = await this.contractService.exportDetailedPdf(filter, user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;Coberturas.pdf',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT)
  @Get(':id')
  getContract(@Param('id', ParseIntPipe) id: number): Promise<ContratorEntity> {
    const data = this.contractService.getContractor(id);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT)
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
