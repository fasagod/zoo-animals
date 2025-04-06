import {
  Collection,
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
} from '@mikro-orm/postgresql';
import { Category } from 'src/category/category.entity';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  fio: string;

  @Property()
  phone: string;

  @Property({ hidden: true })
  token!: string;

  @Property({ default: false })
  inactive: boolean;

  @ManyToMany(() => Category, (category) => category.users, {
    hidden: true,
    owner: true,
  })
  trackedCategories = new Collection<Category>(this);
}
