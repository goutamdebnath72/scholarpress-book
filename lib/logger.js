// lib/logger.js
import pino from 'pino';

// Plain pino logger — structured JSON to the console.
// (The pino-pretty transport is omitted so no extra dependency is needed.)
const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: { service: 'scholarpress', env: process.env.NODE_ENV },
  redact: ['req.headers.authorization', 'user.email'],
});

export default logger;
