import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { Category } from 'src/category/category.entity';

@Entity()
export class Animal {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ type: 'text' })
  description?: string;

  @ManyToMany(() => Category, (category) => category.animals, { owner: true })
  categories = new Collection<Category>(this);
}
