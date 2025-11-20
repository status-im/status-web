import { useReadContract } from 'wagmi'

import { CACHE_CONFIG, STAKING_MANAGER } from '~constants/index'

export function useEmergencyModeEnabled() {
  return useReadContract({
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'emergencyModeEnabled',
    query: {
      refetchInterval: CACHE_CONFIG.EMERGENCY_MODE_REFETCH_INTERVAL,
    },
  })
}
