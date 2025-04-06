import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { Animal } from './animal.entity';
import { User } from 'src/user/user.entity';
import { AnimalDto } from './dto/AnimalDto';
import { ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('animals')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @ApiBody({ type: [AnimalDto] })
  @Post('new')
  async create(@Body() animalDto: AnimalDto): Promise<Animal> {
    return this.animalService.create(
      animalDto.name,
      animalDto.description,
      animalDto.categoryIds,
    );
  }

  @ApiQuery({ type: String, name: 'name', required: false })
  @Get()
  async findAll(
    @Req() req: Request & { user: User & { id?: number } },
    @Query('page') page: number,
    @Query('name') name?: string,
  ): Promise<{ animals: Animal[]; page: number; limit: number }> {
    const userId = req.user.id;

    return this.animalService.findAll(userId, page, name);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Animal | null> {
    return this.animalService.findOne(id);
  }

  @ApiBody({ type: [AnimalDto] })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() animalDto: AnimalDto,
  ): Promise<Animal> {
    return this.animalService.update(
      id,
      animalDto.name,
      animalDto.description,
      animalDto.categoryIds,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.animalService.remove(id);
  }
}
