import { randomUUID } from 'node:crypto';
import type {
  NewProposalDraft,
  ProposalDetail,
  ProposalSummary
} from '@ardtire/domain';

const seededNow = new Date().toISOString();

const proposalStore: ProposalDetail[] = [
  {
    id: randomUUID(),
    slug: 'founding-charter-ratification',
    title: 'Founding Charter Ratification',
    summary:
      'Ratify the initial charter and establish the baseline governance framework.',
    body: [
      'This proposal establishes the initial governance charter for the platform.',
      'It defines the first institutional baseline and authorizes publication as an official record.'
    ].join('\n\n'),
    status: 'submitted',
    createdAt: seededNow,
    updatedAt: seededNow,
    submittedAt: seededNow
  },
  {
    id: randomUUID(),
    slug: 'records-retention-policy',
    title: 'Records Retention Policy',
    summary:
      'Adopt a baseline records retention and publication handling policy.',
    body: [
      'This proposal establishes a baseline records policy for governance artifacts.',
      'It is intentionally seeded as a draft to exercise non-public workflow state.'
    ].join('\n\n'),
    status: 'draft',
    createdAt: seededNow,
    updatedAt: seededNow,
    submittedAt: null
  }
];

function toSummary(proposal: ProposalDetail): ProposalSummary {
  return {
    id: proposal.id,
    slug: proposal.slug,
    title: proposal.title,
    summary: proposal.summary,
    status: proposal.status,
    createdAt: proposal.createdAt,
    updatedAt: proposal.updatedAt
  };
}

export class DuplicateProposalSlugError extends Error {
  constructor(slug: string) {
    super(`A proposal with slug "${slug}" already exists.`);
    this.name = 'DuplicateProposalSlugError';
  }
}

export class ProposalNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Proposal "${identifier}" was not found.`);
    this.name = 'ProposalNotFoundError';
  }
}

export class InMemoryProposalRepository {
  list(): ProposalSummary[] {
    return proposalStore
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toSummary);
  }

  getBySlug(slug: string): ProposalDetail | undefined {
    return proposalStore.find((proposal) => proposal.slug === slug);
  }

  createDraft(input: NewProposalDraft): ProposalDetail {
    const existing = proposalStore.find((proposal) => proposal.slug === input.slug);

    if (existing) {
      throw new DuplicateProposalSlugError(input.slug);
    }

    const now = new Date().toISOString();

    const proposal: ProposalDetail = {
      id: randomUUID(),
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      body: input.body,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      submittedAt: null
    };

    proposalStore.unshift(proposal);

    return proposal;
  }

  submitById(proposalId: string): ProposalDetail {
    const proposal = proposalStore.find((item) => item.id === proposalId);

    if (!proposal) {
      throw new ProposalNotFoundError(proposalId);
    }

    const now = new Date().toISOString();

    proposal.status = 'submitted';
    proposal.submittedAt = now;
    proposal.updatedAt = now;

    return proposal;
  }
}

export const proposalRepository = new InMemoryProposalRepository();
