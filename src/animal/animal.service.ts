import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Animal } from './animal.entity';
import { Category } from '../category/category.entity';
import { User } from 'src/user/user.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: EntityRepository<Animal>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    name: string,
    description: string,
    categoryIds?: number[],
  ): Promise<Animal> {
    const animal = new Animal();
    animal.name = name;
    animal.description = description;
    if (categoryIds) {
      const categories = await this.categoryRepository.find({
        id: { $in: categoryIds },
      });
      categories.forEach((cat) => {
        animal.categories.add(cat);
      });
    }

    await this.animalRepository.getEntityManager().persistAndFlush(animal);
    await this.notificationService.notifyAnimalCreated(animal);
    return animal;
  }

  async findAll(
    userId: number,
    page: number = 1,
    name?: string,
  ): Promise<{ animals: Animal[]; page: number; limit: number }> {
    if (page <= 0) page = 1;
    const limit: number = 100;
    const offset: number = limit * (page - 1);
    const user = await this.userRepository.findOne(userId, {
      populate: ['trackedCategories'],
    });
    const trackedCategories = user?.trackedCategories.map((cat) => cat.id);
    if (!name) {
      const animals = await this.animalRepository.findAll({
        where: { categories: { $in: trackedCategories } },
        limit: limit,
        offset: offset,
      });
      return { animals, page, limit };
    } else {
      const animals = await this.animalRepository.findAll({
        where: {
          name: { $like: name },
          categories: { $in: trackedCategories },
        },
        limit: limit,
        offset: offset,
      });
      return { animals, page, limit };
    }
  }

  async findOne(id: number): Promise<Animal | null> {
    return this.animalRepository.findOne(id);
  }

  async update(
    id: number,
    name: string,
    description: string,
    categoryIds?: number[],
  ): Promise<Animal> {
    const animal = await this.animalRepository.findOne(id);
    if (!animal) {
      throw new Error('Animal not found');
    }
    animal.name = name;
    animal.description = description;
    if (categoryIds) {
      const categories = await this.categoryRepository.find({
        id: { $in: categoryIds },
      });
      animal.categories.set(categories);
    }

    await this.animalRepository.getEntityManager().persistAndFlush(animal);
    return animal;
  }

  async remove(id: number): Promise<void> {
    const animal = await this.animalRepository.findOne(id);
    if (!animal) {
      throw new Error('Animal not found');
    }
    await this.animalRepository.nativeDelete(animal);
  }
}
