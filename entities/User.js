// entities/User.js
import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    email: { type: String, unique: true },
    name: { type: String, nullable: true },
    image: { type: String, nullable: true },
    // 'viewer' | 'publisher' | 'admin'
    role: { type: String, default: 'viewer' },
    locale: { type: String, default: 'en' },
    createdAt: { type: 'timestamptz', createDate: true },
  },
  relations: {
    notes: { type: 'one-to-many', target: 'Note', inverseSide: 'user' },
    bookmarks: { type: 'one-to-many', target: 'Bookmark', inverseSide: 'user' },
  },
});
