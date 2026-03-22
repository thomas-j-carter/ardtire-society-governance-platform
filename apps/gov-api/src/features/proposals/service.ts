import type {
  NewProposalDraft,
  ProposalDetail,
  ProposalSummary
} from '@ardtire/domain';
import { proposalRepository } from './repository.js';

export class ProposalService {
  list(): ProposalSummary[] {
    return proposalRepository.list();
  }

  getBySlug(slug: string): ProposalDetail | undefined {
    return proposalRepository.getBySlug(slug);
  }

  createDraft(input: NewProposalDraft): ProposalDetail {
    return proposalRepository.createDraft(input);
  }

  submit(proposalId: string): ProposalDetail {
    return proposalRepository.submitById(proposalId);
  }
}

export const proposalService = new ProposalService();
