import { Injectable } from '@nestjs/common';
import { CreateLogginDto } from './dto/create-loggin.dto';
import { UpdateLogginDto } from './dto/update-loggin.dto';

@Injectable()
export class LogginService {
  create(createLogginDto: CreateLogginDto) {
    return 'This action adds a new loggin';
  }

  findAll() {
    return `This action returns all loggin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loggin`;
  }

  update(id: number, updateLogginDto: UpdateLogginDto) {
    return `This action updates a #${id} loggin`;
  }

  remove(id: number) {
    return `This action removes a #${id} loggin`;
  }
}
