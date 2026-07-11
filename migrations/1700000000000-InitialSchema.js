// migrations/1700000000000-InitialSchema.js
// Initial schema for ScholarPress. In development, data-source.js runs with
// synchronize:true and creates these tables automatically; in production,
// run migrations explicitly (npm run migration:run).
export class InitialSchema1700000000000 {
  name = 'InitialSchema1700000000000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email"     varchar UNIQUE NOT NULL,
        "name"      varchar,
        "image"     varchar,
        "role"      varchar NOT NULL DEFAULT 'viewer',
        "locale"    varchar NOT NULL DEFAULT 'en',
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(`
      CREATE TABLE "notes" (
        "id"        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId"    uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "title"     varchar NOT NULL,
        "content"   text NOT NULL DEFAULT '',
        "deletedAt" timestamptz,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(`
      CREATE TABLE "bookmarks" (
        "id"        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId"    uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "url"       varchar NOT NULL,
        "title"     varchar,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "bookmarks"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
