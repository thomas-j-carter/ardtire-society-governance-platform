import { proposalStatuses } from '@civic-governance/domain';
import { z } from 'zod';

export const proposalStatusSchema = z.enum(proposalStatuses);

export const proposalSummarySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  status: proposalStatusSchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

export type ProposalSummaryDto = z.infer<typeof proposalSummarySchema>;
