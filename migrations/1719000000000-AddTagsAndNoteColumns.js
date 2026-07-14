// migrations/1719000000000-AddTagsAndNoteColumns.js
//
// The migrations must build the SAME schema the entities describe. They did not:
//
//   * entities/Tag.js declares tables "tags" -- never created by any migration.
//   * entities/Note.js declares the many-to-many join table "notes_tags"
//     -- never created either. Its own comment concedes the point:
//     "synchronize:true creates notes_tags automatically in dev".
//   * entities/Note.js declares isPublished and updatedAt -- absent from
//     InitialSchema's "notes" table.
//
// None of this shows up in development, because data-source.js runs with
// synchronize:true there and builds the schema straight from the entities. In
// production the book (Chapter 2) sets `synchronize: false // migrations only`,
// so the schema comes from these files alone -- and actions/note.js, which uses
// tagRepo on every note write, would fail against it.
export class AddTagsAndNoteColumns1719000000000 {
  name = 'AddTagsAndNoteColumns1719000000000';

  async up(queryRunner) {
    await queryRunner.startTransaction();
    try {
      // --- notes: the two columns the entity declares but the table lacks
      await queryRunner.query(`
        ALTER TABLE "notes"
        ADD COLUMN "isPublished" boolean NOT NULL DEFAULT false
      `);
      await queryRunner.query(`
        ALTER TABLE "notes"
        ADD COLUMN "updatedAt" timestamptz NOT NULL DEFAULT now()
      `);

      // --- tags (entities/Tag.js)
      await queryRunner.query(`
        CREATE TABLE "tags" (
          "id"        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "name"      varchar NOT NULL,
          "userId"    uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
          "createdAt" timestamptz NOT NULL DEFAULT now(),
          CONSTRAINT "uq_tags_user_name" UNIQUE ("userId", "name")
        )`);
      await queryRunner.query(`
        CREATE INDEX "idx_tags_user" ON "tags" ("userId")
      `);

      // --- notes_tags: the join table for the Note <-> Tag many-to-many.
      // Column names must match entities/Note.js exactly (note_id, tag_id).
      await queryRunner.query(`
        CREATE TABLE "notes_tags" (
          "note_id" uuid NOT NULL REFERENCES "notes"("id") ON DELETE CASCADE,
          "tag_id"  uuid NOT NULL REFERENCES "tags"("id")  ON DELETE CASCADE,
          PRIMARY KEY ("note_id", "tag_id")
        )`);
      await queryRunner.query(`
        CREATE INDEX "idx_notes_tags_tag" ON "notes_tags" ("tag_id")
      `);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async down(queryRunner) {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('DROP TABLE IF EXISTS "notes_tags"');
      await queryRunner.query('DROP TABLE IF EXISTS "tags"');
      await queryRunner.query('ALTER TABLE "notes" DROP COLUMN "updatedAt"');
      await queryRunner.query('ALTER TABLE "notes" DROP COLUMN "isPublished"');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }
}
