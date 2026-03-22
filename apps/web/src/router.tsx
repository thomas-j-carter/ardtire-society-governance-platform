import { createRouter } from '@tanstack/solid-router';
import { indexRoute } from './routes/index';
import { rootRoute } from './routes/__root';

const routeTree = rootRoute.addChildren([indexRoute]);

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true
  });
}

declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
