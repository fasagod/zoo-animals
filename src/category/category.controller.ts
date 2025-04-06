import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { ICategoryBranch } from './category.interface';
import { ApiBody } from '@nestjs/swagger';
import { CategoryDto } from './dto/CategoryDto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBody({ type: [CategoryDto] })
  @Post('new')
  async create(@Body() categoryDto: CategoryDto): Promise<Category> {
    return this.categoryService.create(
      categoryDto.name,
      categoryDto.description,
      categoryDto.parentId,
    );
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category | null> {
    return this.categoryService.findOne(id);
  }

  @Get('branchByCat/:id')
  async getBranch(@Param('id') id: number): Promise<ICategoryBranch | null> {
    return this.categoryService.findCategoryBranch(id);
  }

  @ApiBody({ type: [CategoryDto] })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() categoryDto: CategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(
      id,
      categoryDto.name,
      categoryDto.description,
      categoryDto.parentId,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
