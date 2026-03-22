import { healthResponseSchema } from '@ardtire/contracts';
import { Hono } from 'hono';
import { proposalRoutes } from './features/proposals/routes.js';

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

  app.route('/api/proposals', proposalRoutes);

  return app;
}

export type GovApiApp = ReturnType<typeof createApp>;
