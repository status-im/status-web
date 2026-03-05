import type { KarmaApiClient } from '../api/client'
import type { ClaimKarmaResponse } from '../types'

export class SybilModule {
  constructor(private apiClient: KarmaApiClient) {}

  async claimKarmaViaPow(token: string): Promise<ClaimKarmaResponse> {
    return this.apiClient.request<ClaimKarmaResponse>(
      '/sybil/connect-provider/pow',
      {
        method: 'POST',
        body: JSON.stringify({ token }),
      },
    )
  }
}
