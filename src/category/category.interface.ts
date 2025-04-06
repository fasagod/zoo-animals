import { IAnimal } from 'src/animal/animal.interface';
import { IUser } from 'src/user/user.interface';

export interface ICategory {
  id: number;
  name: string;
  description?: string;
  parent?: ICategory;
  children?: ICategory[];
  animals?: IAnimal[];
  employees?: IUser[];
}

export interface ICategoryBranch {
  id: number;
  name: string;
  childrens: ICategoryBranch[];
}
