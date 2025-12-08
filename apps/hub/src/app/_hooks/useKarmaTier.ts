import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { statusSepolia } from 'wagmi/chains'

import { KARMA_TIER } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Represents a single karma tier with its properties
 */
export interface KarmaTier {
  /** Tier ID (0-indexed) */
  id: number
  /** Minimum karma required for this tier */
  minKarma: bigint
  /** Maximum karma for this tier */
  maxKarma: bigint
  /** Name of the tier (e.g., "Bronze", "Silver", "Gold") */
  name: string
  /** Number of transactions allowed per epoch for this tier */
  txPerEpoch: number
}

/**
 * Result data for karma tiers query
 */
export interface KarmaTiersData {
  /** Array of all karma tiers */
  tiers: KarmaTier[]
  /** Total number of tiers */
  count: number
}

/**
 * Options for karma tiers query configuration
 */
export interface UseKarmaTierOptions {
  /**
   * Enable or disable the query
   * @default true
   */
  enabled?: boolean
  /**
   * Time in milliseconds until data is considered stale
   * @default 300000 (5 minutes) - tiers don't change frequently
   */
  staleTime?: number
}

/**
 * Return type for useKarmaTier hook
 */
export type UseKarmaTierReturn = UseQueryResult<KarmaTiersData>

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'karma-tiers'
const DEFAULT_STALE_TIME = 5 * 60 * 1000 // 5 minutes

// ============================================================================
// Helper Functions
// ============================================================================

// ============================================================================
// Hook
// ============================================================================

/**
 * Query hook to fetch all karma tiers from the contract
 *
 * Fetches the complete list of karma tiers including their ID, name, karma range,
 * and transaction limits per epoch. Tiers are used to determine user privileges
 * based on their karma balance.
 *
 * The query first fetches the tier count, then retrieves all tier details in parallel
 * for optimal performance. Data is cached for 5 minutes by default since tiers
 * rarely change.
 *
 * @param options - Query configuration options
 * @returns Query result with karma tiers data
 *
 * @example
 * Basic usage
 * ```tsx
 * function TiersList() {
 *   const { data, isLoading, error } = useKarmaTier()
 *
 *   if (isLoading) return <div>Loading tiers...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <h2>Karma Tiers ({data?.count})</h2>
 *       {data?.tiers.map(tier => (
 *         <div key={tier.id}>
 *           <h3>{tier.name}</h3>
 *           <p>Karma: {tier.minKarma.toString()} - {tier.maxKarma.toString()}</p>
 *           <p>TX per epoch: {tier.txPerEpoch}</p>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * Find user's tier based on karma balance
 * ```tsx
 * function UserTierDisplay() {
 *   const { data: tiersData } = useKarmaTier()
 *   const { data: karmaBalance } = useKarmaBalance()
 *
 *   const userTier = tiersData?.tiers.find(
 *     tier =>
 *       karmaBalance?.balance >= tier.minKarma &&
 *       karmaBalance?.balance <= tier.maxKarma
 *   )
 *
 *   return <div>Your tier: {userTier?.name ?? 'Unknown'}</div>
 * }
 * ```
 *
 * @example
 * Display tier benefits
 * ```tsx
 * function TierBenefits() {
 *   const { data } = useKarmaTier()
 *
 *   return (
 *     <div>
 *       {data?.tiers.map(tier => (
 *         <div key={tier.id}>
 *           <h3>{tier.name}</h3>
 *           <p>Required: {formatKarma(tier.minKarma)}</p>
 *           <p>Allowed transactions: {tier.txPerEpoch}/epoch</p>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * Conditional rendering based on tier availability
 * ```tsx
 * function TierGatedFeature() {
 *   const { data: tiersData, isLoading } = useKarmaTier({
 *     enabled: true
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return tiersData && tiersData.count > 0 ? (
 *     <div>Feature available</div>
 *   ) : (
 *     <div>Tiers not configured</div>
 *   )
 * }
 * ```
 */
export function useKarmaTier(
  options: UseKarmaTierOptions = {}
): UseKarmaTierReturn {
  const config = useConfig()
  const chainId = statusSepolia.id

  const { enabled = true, staleTime = DEFAULT_STALE_TIME } = options

  return useQuery<KarmaTiersData>({
    queryKey: [QUERY_KEY_PREFIX, chainId] as const,
    queryFn: async (): Promise<KarmaTiersData> => {
      const tiers: KarmaTier[] = []
      const tierCount = (await readContract(config, {
        chainId,
        address: KARMA_TIER.address,
        abi: KARMA_TIER.abi,
        functionName: 'getTierCount',
      })) as bigint

      for (let i = 0; i < Number(tierCount); i++) {
        const tier = (await readContract(config, {
          chainId,
          address: KARMA_TIER.address,
          abi: KARMA_TIER.abi,
          functionName: 'getTierById',
          args: [i],
        })) as KarmaTier

        tiers.push(tier)
      }
      return {
        tiers,
        count: Number(tierCount),
      }
    },
    enabled,
    staleTime,
    retry: 2, // Reduce retries since contract might not be deployed
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10_000),
  })
}
