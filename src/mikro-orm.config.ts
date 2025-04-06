import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const config: MikroOrmModuleOptions = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'zoo_animals',
  name: 'postgres',
  password: 'qwerty',
  driver: PostgreSqlDriver,
  highlighter: new SqlHighlighter(),
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator, SeedManager],
};

export default config;
