import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Animal } from 'src/animal/animal.entity';
import { User } from 'src/user/user.entity';

@Module({
  providers: [NotificationService],
  imports: [MikroOrmModule.forFeature({ entities: [Animal, User] })],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
