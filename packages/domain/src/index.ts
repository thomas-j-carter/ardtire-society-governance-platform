export const proposalStatuses = [
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'withdrawn'
] as const;

export type ProposalStatus = (typeof proposalStatuses)[number];

export type ProposalId = string & {
  readonly __brand: 'ProposalId';
};

export interface ProposalSummary {
  id: ProposalId;
  slug: string;
  title: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}
