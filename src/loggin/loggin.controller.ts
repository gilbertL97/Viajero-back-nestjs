import { Controller, Get, Param } from '@nestjs/common';
import { LogginService } from './loggin.service';

@Controller('loggin')
export class LogginController {
  constructor(private readonly logginService: LogginService) {}

  @Get()
  findAll() {
    return this.logginService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logginService.findOne(+id);
  }
}
