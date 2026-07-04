// app/api/health/route.js
export const dynamic = 'force-static';

export async function GET() {
  return Response.json({
    ok: true,
    version: process.env.APP_VERSION ?? 'dev',
  });
}

