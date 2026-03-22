import { createRoute } from '@tanstack/solid-router';
import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

function HomePage() {
  return (
    <main style={{ padding: '2rem', 'font-family': 'system-ui, sans-serif' }}>
      <h1>Ardtire Governance Platform</h1>
      <p>
        This is the initial public web shell. Proposal listing, detail pages,
        and authenticated administrative workflows land in subsequent commits.
      </p>
    </main>
  );
}
