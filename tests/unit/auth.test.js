// tests/unit/auth.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { authConfig } from '@/auth.config';

// auth.config.js defines two callbacks: jwt and session. (An `authorized`
// callback is a common Auth.js pattern, but this project does not use one --
// middleware.js does the gating instead.)
const { jwt, session } = authConfig.callbacks;

describe('jwt callback', () => {
  it('carries the user id into the token on sign-in', async () => {
    const token = await jwt({
      token: {},
      user: { id: '1', role: 'publisher', locale: 'bn' },
      trigger: 'signIn',
    });
    expect(token.id).toBe('1');
  });

  it('sets the role from the user on first sign-in', async () => {
    const token = await jwt({
      token: {},
      user: { id: '1', role: 'publisher' },
      trigger: 'signIn',
    });
    expect(token.role).toBe('publisher');
  });

  it('defaults the role to viewer when the user has none', async () => {
    const token = await jwt({
      token: {},
      user: { id: '1' },
      trigger: 'signIn',
    });
    expect(token.role).toBe('viewer');
  });

  it('defaults the locale to en when the user has none', async () => {
    const token = await jwt({
      token: {},
      user: { id: '1' },
      trigger: 'signIn',
    });
    expect(token.locale).toBe('en');
  });

  it('stamps createdAt on sign-in, for time-based rotation', async () => {
    const before = Date.now();
    const token = await jwt({
      token: {},
      user: { id: '1' },
      trigger: 'signIn',
    });
    expect(token.createdAt).toBeGreaterThanOrEqual(before);
  });

  it('preserves an existing role when no user is passed', async () => {
    const token = await jwt({
      token: { id: '1', role: 'publisher', createdAt: Date.now() },
      trigger: 'update',
    });
    expect(token.role).toBe('publisher');
  });

  it('re-stamps createdAt once the token is older than an hour', async () => {
    const stale = Date.now() - 61 * 60 * 1000;
    const token = await jwt({
      token: { id: '1', role: 'viewer', createdAt: stale },
      trigger: 'update',
    });
    expect(token.createdAt).toBeGreaterThan(stale);
  });

  it('rotates the role on an update trigger', async () => {
    const token = await jwt({
      token: { id: '1', role: 'viewer', createdAt: Date.now() },
      user: { id: '1', role: 'publisher' },
      trigger: 'update',
    });
    expect(token.role).toBe('publisher');
  });
});

describe('session callback', () => {
  it('exposes id, role and locale to the app', async () => {
    const result = await session({
      session: { user: {} },
      token: { id: '1', role: 'publisher', locale: 'bn' },
    });
    expect(result.user.id).toBe('1');
    expect(result.user.role).toBe('publisher');
    expect(result.user.locale).toBe('bn');
  });
});

// The E2E credentials provider (Chapter 4 §4.9) is a security-sensitive piece of
// config: it hands out a session for any email. It must exist when E2E === '1'
// and must be entirely absent otherwise. Both directions are asserted here --
// testing only the happy path would let a production leak through unnoticed.
//
// auth.config.js reads process.env.E2E at module load, so each case needs a
// fresh module registry rather than a mutated import.
describe('E2E credentials provider', () => {
  const ORIGINAL = process.env.E2E;

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.E2E;
    else process.env.E2E = ORIGINAL;
    vi.resetModules();
  });

  it('is absent from a normal (production) build', async () => {
    delete process.env.E2E;
    vi.resetModules();
    const { authConfig: cfg } = await import('@/auth.config');

    const ids = cfg.providers.map((p) => p.id);
    expect(ids).not.toContain('credentials');
    expect(cfg.providers).toHaveLength(1); // GitHub only
  });

  it('is present when E2E === "1"', async () => {
    process.env.E2E = '1';
    vi.resetModules();
    const { authConfig: cfg } = await import('@/auth.config');

    const ids = cfg.providers.map((p) => p.id);
    expect(ids).toContain('credentials');
  });

  it('authorises a supplied email under the flag', async () => {
    process.env.E2E = '1';
    vi.resetModules();
    const { authConfig: cfg } = await import('@/auth.config');

    const e2e = cfg.providers.find((p) => p.type === 'credentials');
    // Auth.js keeps the supplied authorize on .options; the top-level property
    // is a stub that always returns null.
    const authorize = e2e.options.authorize;

    const user = await authorize({ email: 'test@example.com' });
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('viewer');
  });

  it('refuses to authorise without an email', async () => {
    process.env.E2E = '1';
    vi.resetModules();
    const { authConfig: cfg } = await import('@/auth.config');

    const e2e = cfg.providers.find((p) => p.type === 'credentials');
    // Auth.js keeps the supplied authorize on .options; the top-level property
    // is a stub that always returns null.
    const authorize = e2e.options.authorize;

    expect(await authorize({})).toBeNull();
  });
});
