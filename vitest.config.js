// vitest.config.js
import { defineConfig } from 'vitest/config'
import react           from '@vitejs/plugin-react'
import path            from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',      // server-side code; not 'jsdom'
    globals:     true,        // describe/it/expect without imports
    setupFiles:  ['./tests/setup.js'],
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
