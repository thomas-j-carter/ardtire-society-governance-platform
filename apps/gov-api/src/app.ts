import { Hono } from 'hono';
import { healthResponseSchema } from '@civic-governance/contracts';

export function createApp() {
  const app = new Hono();

  app.get('/health', (c) => {
    const response = healthResponseSchema.parse({
      ok: true,
      service: 'gov-api',
      timestamp: new Date().toISOString()
    });

    return c.json(response, 200);
  });

  return app;
}

export type GovApiApp = ReturnType<typeof createApp>;
