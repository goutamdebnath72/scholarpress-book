// vitest.config.js
import { defineConfig } from 'vitest/config';
import react           from '@vitejs/plugin-react';
import path            from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',      // server-side code; not 'jsdom'
    globals:     true,        // describe/it/expect without imports
    setupFiles:  ['./tests/setup.js'],
    // Vitest scans tests/** by default, which swallows the Playwright specs in
    // tests/e2e/ -- Playwright then refuses, because test() was called outside
    // its own runner. `npm test` runs Vitest; `npx playwright test` runs e2e.
    exclude:     ['**/node_modules/**', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Require 80% coverage on all metrics
      thresholds: {
        lines:      80,
        functions:  80,
        branches:   75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
