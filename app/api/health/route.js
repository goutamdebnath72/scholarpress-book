// app/api/health/route.js
import { AppDataSource } from '@/data-source';
import logger from '@/lib/logger';

// Never cache this route — every poll must hit the server
export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  const checks = { database: 'unknown' };

  try {
    await AppDataSource.query('SELECT 1');
    checks.database = 'ok';
    checks.latencyMs = Date.now() - start;
  } catch (err) {
    checks.database = 'error';
    logger.error({ err }, 'Health check: database unreachable');
    return Response.json(
      { status: 'degraded', checks, uptime: process.uptime() },
      { status: 503 },
    );
  }

  return Response.json({ status: 'ok', checks, uptime: process.uptime() });
}
