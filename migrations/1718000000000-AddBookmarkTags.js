// migrations/1718000000000-AddBookmarkTags.js
// TypeORM calls up() to apply the change and down() to revert it.

export class AddBookmarkTags1718000000000 {
  async up(queryRunner) {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
        ALTER TABLE "bookmarks"
        ADD COLUMN tags text[] NOT NULL DEFAULT '{}'
      `);
      await queryRunner.query(`
        CREATE INDEX bookmark_tags_gin
        ON "bookmarks" USING GIN(tags)
      `);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async down(queryRunner) {
    await queryRunner.query('DROP INDEX bookmark_tags_gin');
    await queryRunner.query('ALTER TABLE "bookmarks" DROP COLUMN tags');
  }
}
