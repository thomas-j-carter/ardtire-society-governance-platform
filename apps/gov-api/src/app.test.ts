import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('gov-api', () => {
  it('returns a healthy response payload', async () => {
    const app = createApp();
    const response = await app.request('/health');

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject({
      ok: true,
      service: 'gov-api'
    });
  });

  it('lists seeded proposals', async () => {
    const app = createApp();
    const response = await app.request('/api/proposals');

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
  });
});
