import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TravelerService } from './traveler.service';
import { CreateTravelerDto } from './dto/create-traveler.dto';
import { UpdateTravelerDto } from './dto/update-traveler.dto';
import { TravelerEntity } from './entity/traveler.entity';

@Controller('traveler')
export class TravelerController {
  constructor(private readonly travelerService: TravelerService) {}

  @Post()
  async createTraveler(
    @Body() createTravelerDto: CreateTravelerDto,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.create(createTravelerDto);
    return data;
  }

  @Get()
  async getTravelers(): Promise<TravelerEntity[]> {
    const data = await this.travelerService.findAll();
    return data;
  }

  @Get(':id')
  async getTraveler(@Param('id') id: string): Promise<TravelerEntity> {
    const data = await this.travelerService.findOne(id);
    return data;
  }

  @Patch(':id')
  async updateTraveler(
    @Param('id') id: string,
    @Body() updateTravelerDto: UpdateTravelerDto,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.update(id, updateTravelerDto);
    return data;
  }

  @Delete(':id')
  async deleteTraveler(@Param('id') id: string): Promise<TravelerEntity> {
    const data = await this.travelerService.remove(id);
    return data;
  }
}
