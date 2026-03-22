import { createFileRoute } from '@tanstack/solid-router';
import { createServerFn } from '@tanstack/solid-start';
import { proposalSlugParamsSchema } from '@ardtire/contracts';
import { GovClient } from '@ardtire/gov-client';

function getGovApiBaseUrl() {
  return process.env.GOV_API_BASE_URL ?? 'http://localhost:3002';
}

const getProposalBySlug = createServerFn({ method: 'GET' })
  .inputValidator(proposalSlugParamsSchema)
  .handler(async ({ data }) => {
    const client = new GovClient({
      baseUrl: getGovApiBaseUrl()
    });

    return client.getProposalBySlug(data.slug);
  });

export const Route = createFileRoute('/proposals/$slug')({
  loader: async ({ params }) =>
    await getProposalBySlug({
      data: {
        slug: params.slug
      }
    }),
  component: ProposalDetailPage
});

function ProposalDetailPage() {
  const proposal = Route.useLoaderData();

  return (
    <main style={{ padding: '2rem', 'font-family': 'system-ui, sans-serif' }}>
      <p>
        <a href="/">← Back to proposals</a>
      </p>

      <h1>{proposal().title}</h1>
      <p>{proposal().summary}</p>

      <dl>
        <dt>Status</dt>
        <dd>{proposal().status}</dd>

        <dt>Slug</dt>
        <dd>{proposal().slug}</dd>

        <dt>Created</dt>
        <dd>{proposal().createdAt}</dd>

        <dt>Updated</dt>
        <dd>{proposal().updatedAt}</dd>

        <dt>Submitted</dt>
        <dd>{proposal().submittedAt ?? 'Not yet submitted'}</dd>
      </dl>

      <article>
        <h2>Body</h2>
        <pre
          style={{
            'white-space': 'pre-wrap',
            'font-family': 'inherit',
            background: '#f6f6f6',
            padding: '1rem',
            'border-radius': '0.5rem'
          }}
        >
          {proposal().body}
        </pre>
      </article>
    </main>
  );
}
