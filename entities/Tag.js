// entities/Tag.js
import { EntitySchema } from 'typeorm'

export const Tag = new EntitySchema({
  name: 'Tag',
  tableName: 'tags',
  columns: {
    id:     { type: 'uuid', primary: true, generated: 'uuid' },
    name:   { type: String },
    // Tags are scoped per user, so two people can each have a
    // "physics" tag without collliding.
    userId: { type: 'uuid' },
    createdAt: { type: 'timestamptz', createDate: true },
  },
  relations: {
    notes: {
      type: 'many-to-many',
      target: 'Note',
      inverseSide: 'tags',
    },
  },
  // A user cannot have two tags with the same name.
  uniques: [
    { name: 'uq_tags_user_name', columns: ['userId', 'name'] },
  ],
  indices: [
    { name: 'idx_tags_user', columns: ['userId'] },
  ],
})
