// eslint.config.js
// ESLint 9 uses "flat config" and no longer reads .eslintrc.*. The project
// shipped no ESLint config at all, so `npm run lint` -- a command the book tells
// the reader to run -- failed outright. eslint-config-next v16 exports a native
// flat config, so it is imported directly (no FlatCompat bridge needed).
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    // Playwright fixtures call use() to hand the fixture to the test. That is
    // Playwright's API, not React's -- react-hooks/rules-of-hooks matches it on
    // the name alone and misfires. There is no React in this directory at all.
    files: ['tests/e2e/**/*.js'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
];

export default config;
