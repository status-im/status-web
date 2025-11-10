'use client'

import { useReadContract } from 'wagmi'

import { STAKING_MANAGER } from '~constants/index'
import { CACHE_CONFIG } from '~constants/staking'

export function useEmergencyModeEnabled() {
  return useReadContract({
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'emergencyModeEnabled',
    query: {
      refetchInterval: CACHE_CONFIG.EMERGENCY_MODE_REFETCH_INTERVAL,
      enabled: typeof window !== 'undefined',
    },
  })
}
