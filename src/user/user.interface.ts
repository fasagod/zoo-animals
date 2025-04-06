import { ICategory } from 'src/category/category.interface';

export interface IUser {
  id: number;
  fio: string;
  phone: string;
  trackedCategories?: ICategory[];
  token: string;
  inactive: boolean;
}
