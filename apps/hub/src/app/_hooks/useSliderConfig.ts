import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'

import { STAKING_MANAGER } from '../../config'
import { stakingManagerAbi } from '../contracts'

// ============================================================================
// Types
// ============================================================================

/**
 * Slider configuration for lockup periods
 */
export interface SliderConfig {
  /** Minimum lockup period in seconds */
  min: number
  /** Maximum lockup period in seconds */
  max: number
}

/**
 * Return type for the useSliderConfig hook
 */
export type UseSliderConfigReturn = UseQueryResult<SliderConfig, Error>

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'slider-config' as const
const STALE_TIME = 5 * 60 * 1000 // 5 minutes
const CACHE_TIME = 10 * 60 * 1000 // 10 minutes

// ============================================================================
// Query Hook
// ============================================================================

/**
 * Query hook to fetch slider configuration for vault lockup periods
 *
 * Retrieves MIN_LOCKUP_PERIOD and MAX_LOCKUP_PERIOD from the staking manager
 * contract to configure the lockup period slider UI component.
 *
 * @returns Query result with slider configuration data
 *
 * @throws {Error} When contract read fails
 * @throws {Error} When contract returns invalid values
 *
 * @example
 * Basic usage
 * ```tsx
 * function LockupSlider() {
 *   const { data: config, isLoading } = useSliderConfig()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (!config) return <div>Failed to load config</div>
 *
 *   return (
 *     <Slider
 *       min={config.min}
 *       max={config.max}
 *     />
 *   )
 * }
 * ```
 *
 * @example
 * With error handling
 * ```tsx
 * function LockupConfig() {
 *   const { data: config, isLoading, isError, error } = useSliderConfig()
 *
 *   if (isLoading) return <Spinner />
 *   if (isError) return <ErrorMessage error={error} />
 *
 *   return (
 *     <div>
 *       <p>Min: {config.min} seconds</p>
 *       <p>Max: {config.max} seconds</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useSliderConfig(): UseSliderConfigReturn {
  const config = useConfig()

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX],
    queryFn: async (): Promise<SliderConfig> => {
      try {
        // Fetch minimum lockup period
        const minLockupPeriod = await readContract(config, {
          address: STAKING_MANAGER.address,
          abi: stakingManagerAbi,
          functionName: 'MIN_LOCKUP_PERIOD',
        })

        // Fetch maximum lockup period
        const maxLockupPeriod = await readContract(config, {
          address: STAKING_MANAGER.address,
          abi: stakingManagerAbi,
          functionName: 'MAX_LOCKUP_PERIOD',
        })

        // Validate results
        if (
          typeof minLockupPeriod !== 'bigint' ||
          typeof maxLockupPeriod !== 'bigint'
        ) {
          throw new Error('Invalid lockup period values returned from contract')
        }

        // Ensure min is less than max
        if (minLockupPeriod >= maxLockupPeriod) {
          throw new Error(
            'Minimum lockup period must be less than maximum lockup period'
          )
        }

        return {
          min: Number(minLockupPeriod),
          max: Number(maxLockupPeriod),
        }
      } catch (error) {
        throw new Error(
          `Failed to fetch slider configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  })
}
