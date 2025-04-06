import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Collection,
  ManyToMany,
} from '@mikro-orm/core';
import { Animal } from 'src/animal/animal.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Category {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ type: 'text' })
  description?: string;

  @ManyToOne(() => Category, { nullable: true })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children = new Collection<Category>(this);

  @ManyToMany(() => Animal, (animal) => animal.categories)
  animals = new Collection<Animal>(this);

  @ManyToMany(() => User, (user) => user.trackedCategories)
  users = new Collection<User>(this);
}
