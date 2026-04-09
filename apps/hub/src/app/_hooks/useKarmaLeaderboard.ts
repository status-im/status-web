import { useQuery } from '@tanstack/react-query'

import { clientEnv } from '~constants/env.client.mjs'

import type { KarmaLeaderboardData } from '~types/karma'

type KarmaLeaderboardResponse = {
  result: KarmaLeaderboardData
}

const API_ENDPOINT = `${clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL}/karma/leaderboard`

const fetchLeaderboard = async (): Promise<KarmaLeaderboardData> => {
  const response = await fetch(API_ENDPOINT, { credentials: 'include' })

  if (!response.ok) {
    throw new Error(`Leaderboard fetch failed: ${response.status}`)
  }

  const data: KarmaLeaderboardResponse = await response.json()
  return data.result
}

export const useKarmaLeaderboard = () => {
  return useQuery({
    queryKey: ['karma-leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}
