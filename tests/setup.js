// tests/setup.js — shared Vitest setup
//
// Unit tests mock the data layer, so no database connection is opened here. The
// file exists because vitest.config.js lists it in setupFiles; it is the place to
// put anything every test needs.
import { vi, afterEach } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});
