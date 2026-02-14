import {
  claimKarmaViaPow,
  isValidCaptchaToken,
  KarmaApiClient,
} from '@status-im/karma-sdk'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { clientEnv } from '~constants/env.client.mjs'

export function useClaimKarma() {
  const queryClient = useQueryClient()
  const apiClient = new KarmaApiClient({
    baseUrl: clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL,
  })

  return useMutation({
    mutationKey: ['claim-karma'],
    mutationFn: async ({ token }: { token: string }) => {
      if (!isValidCaptchaToken(token)) {
        throw new Error('Token is required')
      }
      return claimKarmaViaPow(apiClient, { token })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      queryClient.invalidateQueries({ queryKey: ['karma-balance'] })
      queryClient.invalidateQueries({ queryKey: ['karma-rewards-balance'] })
    },
  })
}
