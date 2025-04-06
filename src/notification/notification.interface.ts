import { Animal } from 'src/animal/animal.entity';

export interface AnimalMessage {
  animal: Animal;
  userId: number;
}
