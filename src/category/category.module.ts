import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from './category.entity';

@Module({
  controllers: [CategoryController],
  exports: [CategoryService],
  imports: [MikroOrmModule.forFeature({ entities: [Category] })],
  providers: [CategoryService],
})
export class CategoryModule {}
