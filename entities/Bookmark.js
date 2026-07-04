// entities/Bookmark.js
import { EntitySchema } from 'typeorm'

export const Bookmark = new EntitySchema({
  name: 'Bookmark',
  tableName: 'bookmarks',
  columns: {
    id:    { type: 'uuid', primary: true,
             generated: 'uuid' },
    url:   { type: String },
    title: { type: String, nullable: true },
    // denormalised FK for faster lookups
    userId: { type: 'uuid' },
    createdAt: { type: 'timestamptz',
                 createDate: true },
  },
  relations: {
    user: { type: 'many-to-one', target: 'User',
            inverseSide: 'bookmarks',
            onDelete: 'CASCADE' },
  },
  // all queries filter by userId
  indices: [
    { name: 'idx_bookmarks_user',
      columns: ['userId'] },
  ],
})
