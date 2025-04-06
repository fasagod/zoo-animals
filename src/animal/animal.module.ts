import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Animal } from './animal.entity';
import { AnimalController } from './animal.controller';
import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  providers: [AnimalService, NotificationService],
  imports: [
    MikroOrmModule.forFeature({
      entities: [Animal, Category, User],
    }),
  ],
  exports: [AnimalService],
  controllers: [AnimalController],
})
export class AnimalModule {}
