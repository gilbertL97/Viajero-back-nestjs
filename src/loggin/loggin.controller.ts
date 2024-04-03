import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LogginService } from './loggin.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { FilterLogginDto } from './dto/filter-loggin.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRole } from 'src/user/user.role';

@Controller('loggin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class LogginController {
  constructor(private readonly logginService: LogginService) {}

  @Get()
  findAll(@Query() pag: PaginationDto, @Query() logginFilter: FilterLogginDto) {
    return this.logginService.findAll(pag, logginFilter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logginService.findOne(+id);
  }
}
