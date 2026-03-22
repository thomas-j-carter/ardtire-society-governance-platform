import { proposalStatuses } from '@ardtire/domain';
import { z } from 'zod';

export const proposalStatusSchema = z.enum(proposalStatuses);

export const proposalSummarySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: proposalStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const proposalDetailSchema = proposalSummarySchema.extend({
  body: z.string().min(1),
  submittedAt: z.string().datetime().nullable()
});

export const proposalListResponseSchema = z.object({
  items: z.array(proposalSummarySchema)
});

export const proposalSlugParamsSchema = z.object({
  slug: z.string().min(1)
});

export const proposalIdParamsSchema = z.object({
  proposalId: z.string().min(1)
});

export const createProposalDraftRequestSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().min(1)
});

export const createProposalDraftResponseSchema = z.object({
  proposal: proposalDetailSchema
});

export const submitProposalResponseSchema = z.object({
  proposal: proposalDetailSchema
});

export type ProposalSummaryDto = z.infer<typeof proposalSummarySchema>;
export type ProposalDetailDto = z.infer<typeof proposalDetailSchema>;
export type ProposalListResponse = z.infer<typeof proposalListResponseSchema>;
export type ProposalSlugParams = z.infer<typeof proposalSlugParamsSchema>;
export type ProposalIdParams = z.infer<typeof proposalIdParamsSchema>;
export type CreateProposalDraftRequest = z.infer<
  typeof createProposalDraftRequestSchema
>;
export type CreateProposalDraftResponse = z.infer<
  typeof createProposalDraftResponseSchema
>;
export type SubmitProposalResponse = z.infer<
  typeof submitProposalResponseSchema
>;
