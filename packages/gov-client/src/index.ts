import {
  createProposalDraftRequestSchema,
  createProposalDraftResponseSchema,
  healthResponseSchema,
  proposalDetailSchema,
  proposalListResponseSchema,
  submitProposalResponseSchema,
  type CreateProposalDraftRequest,
  type CreateProposalDraftResponse,
  type HealthResponse,
  type ProposalDetailDto,
  type ProposalListResponse,
  type SubmitProposalResponse
} from '@ardtire/contracts';

export interface GovClientOptions {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
}

export class GovClientError extends Error {
  readonly status: number;
  readonly responseBody: string;

  constructor(message: string, status: number, responseBody: string) {
    super(message);
    this.name = 'GovClientError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

export class GovClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;

  constructor(options: GovClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.fetchImpl = options.fetch ?? globalThis.fetch;
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await this.request('/health', {
      method: 'GET'
    });

    return healthResponseSchema.parse(await response.json());
  }

  async listProposals(): Promise<ProposalListResponse> {
    const response = await this.request('/api/proposals', {
      method: 'GET'
    });

    return proposalListResponseSchema.parse(await response.json());
  }

  async getProposalBySlug(slug: string): Promise<ProposalDetailDto> {
    const response = await this.request(
      `/api/proposals/${encodeURIComponent(slug)}`,
      {
        method: 'GET'
      }
    );

    return proposalDetailSchema.parse(await response.json());
  }

  async createProposalDraft(
    input: CreateProposalDraftRequest
  ): Promise<CreateProposalDraftResponse> {
    const payload = createProposalDraftRequestSchema.parse(input);

    const response = await this.request('/api/proposals', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return createProposalDraftResponseSchema.parse(await response.json());
  }

  async submitProposal(proposalId: string): Promise<SubmitProposalResponse> {
    const response = await this.request(
      `/api/proposals/${encodeURIComponent(proposalId)}/submit`,
      {
        method: 'POST'
      }
    );

    return submitProposalResponseSchema.parse(await response.json());
  }

  private async request(path: string, init: RequestInit): Promise<Response> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        accept: 'application/json',
        ...(init.headers ?? {})
      }
    });

    if (response.ok) {
      return response;
    }

    const body = await response.text();

    throw new GovClientError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
      body
    );
  }
}
