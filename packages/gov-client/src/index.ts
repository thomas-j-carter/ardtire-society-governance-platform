import {
  healthResponseSchema,
  type HealthResponse
} from '@ardtire/contracts';

export interface GovClientOptions {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
}

export class GovClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;

  constructor(options: GovClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.fetchImpl = options.fetch ?? globalThis.fetch;
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await this.fetchImpl(`${this.baseUrl}/health`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Health request failed with status ${response.status}`);
    }

    return healthResponseSchema.parse(await response.json());
  }
}
