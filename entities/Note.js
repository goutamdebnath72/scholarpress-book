// entities/Note.js
import { EntitySchema } from 'typeorm';

export const Note = new EntitySchema({
  name: 'Note',
  tableName: 'notes',
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    title: { type: String },
    content: { type: 'text', nullable: true },
    isPublished: { type: Boolean, default: false },
    userId: { type: 'uuid' },
    createdAt: { type: 'timestamptz', createDate: true },
    updatedAt: { type: 'timestamptz', updateDate: true },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'notes',
      onDelete: 'CASCADE',
    },
    // Many-to-many: the owning side defines the join table.
    // synchronize:true creates notes_tags automatically in dev.
    tags: {
      type: 'many-to-many',
      target: 'Tag',
      inverseSide: 'notes',
      joinTable: {
        name: 'notes_tags',
        joinColumn: { name: 'note_id' },
        inverseJoinColumn: { name: 'tag_id' },
      },
      cascade: false,
    },
  },
  indices: [{ name: 'idx_notes_user', columns: ['userId'] }],
});
