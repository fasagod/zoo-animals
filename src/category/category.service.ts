import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Category } from './category.entity';
import { ICategoryBranch } from './category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}

  async create(
    name: string,
    description: string,
    parentId?: number,
  ): Promise<Category> {
    const category = new Category();
    category.name = name;
    category.description = description;
    if (parentId) {
      const parent = await this.categoryRepository.findOne(parentId);
      if (parent) {
        category.parent = parent;
      }
    }
    await this.categoryRepository.getEntityManager().persistAndFlush(category);
    return category;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne(id);
  }

  async findCategoryBranch(id: number): Promise<CategoryBranch | null> {
    const cat = await this.categoryRepository.findOne(id, {
      populate: ['children'],
    });
    if (!cat) {
      return null;
    }
    return await this.buildBranch(cat);
  }

  private async buildBranch(category: Category): Promise<ICategoryBranch> {
    const branch: ICategoryBranch = {
      id: category.id,
      name: category.name,
      childrens: [],
    };
    const items = await category.children.loadItems();
    for (const item of items) {
      branch.childrens.push(await this.buildBranch(item));
    }

    return branch;
  }

  async update(
    id: number,
    name: string,
    description: string,
    parentId?: number,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    category.name = name;
    category.description = description;
    if (parentId) {
      const parent = await this.categoryRepository.findOne(parentId);
      if (parent) {
        category.parent = parent;
      }
    }
    await this.categoryRepository.getEntityManager().persistAndFlush(category);
    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    await this.categoryRepository.nativeDelete(category);
  }
}
interface CategoryBranch {
  id: number;
  name: string;
  childrens: Array<CategoryBranch>;
}
