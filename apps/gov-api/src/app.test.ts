import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('gov-api health route', () => {
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
});
