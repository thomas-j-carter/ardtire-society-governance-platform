export const proposalStatuses = [
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'withdrawn'
] as const;

export type ProposalStatus = (typeof proposalStatuses)[number];

export type ProposalId = string;

export interface ProposalSummary {
  id: ProposalId;
  slug: string;
  title: string;
  summary: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalDetail extends ProposalSummary {
  body: string;
  submittedAt: string | null;
}

export interface NewProposalDraft {
  slug: string;
  title: string;
  summary: string;
  body: string;
}
