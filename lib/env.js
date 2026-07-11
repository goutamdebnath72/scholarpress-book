// lib/env.js — validate all env vars at startup
// This file is imported by data-source.js and auth.config.js
// An error here means the server refuses to start rather than
// failing silently at runtime

const required = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'AUTH_GITHUB_ID',
  'AUTH_GITHUB_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

const missing = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables:\n` +
      missing.map((k) => `  - ${k}`).join('\n'),
  );
}

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  authSecret: process.env.AUTH_SECRET,
  githubClientId: process.env.AUTH_GITHUB_ID,
  githubClientSecret: process.env.AUTH_GITHUB_SECRET,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
};
