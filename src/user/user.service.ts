import { Injectable } from '@nestjs/common';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<{ user: User; trackedCategoriesCount: number }[]> {
    const users = await this.userRepository.findAll({
      populate: ['trackedCategories'],
    });

    return users.map((user) => ({
      user,
      trackedCategoriesCount: user.trackedCategories.getItems().length,
    }));
  }

  async findByToken(token: string): Promise<Loaded<User> | null> {
    try {
      return await this.userRepository.findOne({ token: token });
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async findById(id: number): Promise<Loaded<User> | null> {
    return this.userRepository.findOne(id);
  }
}
