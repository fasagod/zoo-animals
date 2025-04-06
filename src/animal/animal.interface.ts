import { ICategory } from 'src/category/category.interface';

export interface IAnimal {
  id: number;
  name: string;
  description?: string;
  categories?: ICategory[];
}
