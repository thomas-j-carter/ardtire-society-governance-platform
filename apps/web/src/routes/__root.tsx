/// <reference types="vite/client" />

import * as Solid from 'solid-js';
import { HydrationScript } from 'solid-js/web';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute
} from '@tanstack/solid-router';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body>
        <Solid.Suspense>
          <Outlet />
        </Solid.Suspense>
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <main style={{ padding: '2rem', 'font-family': 'system-ui, sans-serif' }}>
      <h1>Page not found</h1>
      <p>The requested route does not exist.</p>
    </main>
  );
}
