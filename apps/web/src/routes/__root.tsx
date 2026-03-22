/// <reference types="vite/client" />

import * as Solid from 'solid-js';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute
} from '@tanstack/solid-router';
import { HydrationScript } from 'solid-js/web';

export const rootRoute = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'Ardtire Society Governance Platform'
      }
    ]
  }),
  component: RootComponent
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument(props: Readonly<{ children: Solid.JSX.Element }>) {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body>
        <Solid.Suspense>{props.children}</Solid.Suspense>
        <Scripts />
      </body>
    </html>
  );
}
