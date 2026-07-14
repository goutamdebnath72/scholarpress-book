// data-source.js
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User.js';
import { Note } from './entities/Note.js';
import { Bookmark } from './entities/Bookmark.js';
import { Tag } from './entities/Tag.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Supabase requires SSL on every connection, including in development.
  // A local or CI Postgres does not speak TLS at all, and node-postgres gives
  // this explicit `ssl` option precedence over any sslmode in the URL -- so
  // hardcoding it makes those databases unreachable. Enable SSL unless the
  // connection is plainly local.
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? '')
    ? false
    : { rejectUnauthorized: false },
  entities: [User, Note, Bookmark, Tag],

  // Auto-create tables from entities in development; use migrations in production.
  synchronize: process.env.NODE_ENV !== 'production',

  logging:
    process.env.NODE_ENV === 'development' ? ['error', 'schema'] : ['error'],
  maxQueryExecutionTime: 1000,

  migrations: ['migrations/*.js'],
  migrationsRun: false,
});

// Initialize the DataSource exactly once, even across hot-reloads / repeated
// imports. Every data-access path awaits this before using a repository.
let initPromise = null;
export function getDataSource() {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);
  if (!initPromise) initPromise = AppDataSource.initialize();
  return initPromise;
}

// Repository helpers — resolved after initialization so they are never
// accessed before the connection is ready.
export async function getRepos() {
  const ds = await getDataSource();
  return {
    userRepo: ds.getRepository(User),
    noteRepo: ds.getRepository(Note),
    bookmarkRepo: ds.getRepository(Bookmark),
    tagRepo: ds.getRepository(Tag),
  };
}
