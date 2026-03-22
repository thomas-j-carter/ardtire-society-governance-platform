import { For } from 'solid-js';
import { Link, createFileRoute } from '@tanstack/solid-router';
import { createServerFn } from '@tanstack/solid-start';
import { GovClient } from '@ardtire/gov-client';

function getGovApiBaseUrl() {
  return process.env.GOV_API_BASE_URL ?? 'http://localhost:3002';
}

const getHomePageData = createServerFn({ method: 'GET' }).handler(async () => {
  const client = new GovClient({
    baseUrl: getGovApiBaseUrl()
  });

  const [health, proposals] = await Promise.all([
    client.getHealth(),
    client.listProposals()
  ]);

  return {
    health,
    proposals
  };
});

export const Route = createFileRoute('/')({
  loader: async () => await getHomePageData(),
  component: HomePage
});

function HomePage() {
  const data = Route.useLoaderData();

  return (
    <main style={{ padding: '2rem', 'font-family': 'system-ui, sans-serif' }}>
      <h1>Ardtire Governance Platform</h1>

      <section style={{ 'margin-bottom': '2rem' }}>
        <h2>API health</h2>
        <p>
          <strong>Service:</strong> {data().health.service}
        </p>
        <p>
          <strong>Healthy:</strong> {String(data().health.ok)}
        </p>
        <p>
          <strong>Timestamp:</strong> {data().health.timestamp}
        </p>
      </section>

      <section>
        <h2>Proposals</h2>

        <ul style={{ padding: 0, margin: 0, 'list-style': 'none' }}>
          <For each={data().proposals.items}>
            {(proposal) => (
              <li
                style={{
                  padding: '1rem 0',
                  'border-bottom': '1px solid #ddd'
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0' }}>
                  <Link to="/proposals/$slug" params={{ slug: proposal.slug }}>
                    {proposal.title}
                  </Link>
                </h3>
                <p style={{ margin: '0 0 0.5rem 0' }}>{proposal.summary}</p>
                <small>
                  status={proposal.status} · slug={proposal.slug}
                </small>
              </li>
            )}
          </For>
        </ul>
      </section>
    </main>
  );
}
