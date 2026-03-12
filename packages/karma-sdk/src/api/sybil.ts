import type { ClaimKarmaResponse } from '../types'
import type { KarmaApiClient } from './client'

export async function claimKarmaViaPow(
  client: KarmaApiClient,
  params: { token: string },
): Promise<ClaimKarmaResponse> {
  return client.request<ClaimKarmaResponse>('/sybil/connect-provider/pow', {
    method: 'POST',
    body: JSON.stringify({ token: params.token }),
  })
}
