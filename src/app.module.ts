import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { AuthMiddleware } from './user/auth.middleware';
import { AnimalModule } from './animal/animal.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { MikroORM } from '@mikro-orm/postgresql';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { AnimalController } from './animal/animal.controller';
import { CategoryController } from './category/category.controller';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    EventEmitterModule.forRoot(),
    AnimalModule,
    CategoryModule,
    UserModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}
  async onModuleInit(): Promise<void> {
    // await this.orm.getMigrator().up();
    await this.orm.getSchemaGenerator().updateSchema();
    // await this.orm.getSchemaGenerator().createSchema();
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UserController, AnimalController, CategoryController);
  }
}
