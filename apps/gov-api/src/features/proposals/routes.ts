import {
  createProposalDraftRequestSchema,
  createProposalDraftResponseSchema,
  proposalDetailSchema,
  proposalIdParamsSchema,
  proposalListResponseSchema,
  proposalSlugParamsSchema,
  submitProposalResponseSchema
} from '@ardtire/contracts';
import { Hono } from 'hono';
import {
  DuplicateProposalSlugError,
  ProposalNotFoundError
} from './repository.js';
import { proposalService } from './service.js';

export const proposalRoutes = new Hono();

proposalRoutes.get('/', (c) => {
  const response = proposalListResponseSchema.parse({
    items: proposalService.list()
  });

  return c.json(response, 200);
});

proposalRoutes.get('/:slug', (c) => {
  const { slug } = proposalSlugParamsSchema.parse({
    slug: c.req.param('slug')
  });

  const proposal = proposalService.getBySlug(slug);

  if (!proposal) {
    return c.json(
      {
        code: 'PROPOSAL_NOT_FOUND',
        message: `Proposal "${slug}" was not found.`
      },
      404
    );
  }

  return c.json(proposalDetailSchema.parse(proposal), 200);
});

proposalRoutes.post('/', async (c) => {
  const payload = createProposalDraftRequestSchema.parse(await c.req.json());

  try {
    const proposal = proposalService.createDraft(payload);

    return c.json(
      createProposalDraftResponseSchema.parse({
        proposal
      }),
      201
    );
  } catch (error) {
    if (error instanceof DuplicateProposalSlugError) {
      return c.json(
        {
          code: 'DUPLICATE_PROPOSAL_SLUG',
          message: error.message
        },
        409
      );
    }

    throw error;
  }
});

proposalRoutes.post('/:proposalId/submit', (c) => {
  const { proposalId } = proposalIdParamsSchema.parse({
    proposalId: c.req.param('proposalId')
  });

  try {
    const proposal = proposalService.submit(proposalId);

    return c.json(
      submitProposalResponseSchema.parse({
        proposal
      }),
      200
    );
  } catch (error) {
    if (error instanceof ProposalNotFoundError) {
      return c.json(
        {
          code: 'PROPOSAL_NOT_FOUND',
          message: error.message
        },
        404
      );
    }

    throw error;
  }
});
