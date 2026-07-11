// lib/db.js — run a query with the current user set, so RLS policies can see it
//
// Supabase Row-Level Security filters every query by a policy that reads
// app.current_user_id. TypeORM connects as the database owner, so that variable has
// to be set per transaction — otherwise the policies have nothing to match on and the
// query returns nothing.
import { getDataSource } from '@/data-source';

export async function withUserContext(userId, fn) {
  const ds = await getDataSource();
  const queryRunner = ds.createQueryRunner();
  await queryRunner.connect();
  try {
    // SET LOCAL scopes the variable to this transaction only
    await queryRunner.query(`SET LOCAL app.current_user_id = '${userId}'`);
    return await fn(queryRunner.manager);
  } finally {
    await queryRunner.release();
  }
}
