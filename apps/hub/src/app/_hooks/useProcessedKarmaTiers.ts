import { useMemo } from 'react'

import { useKarmaTier } from '~hooks/useKarmaTier'

import type { KarmaLevel } from '~types/karma'

// ============================================================================
// Types
// ============================================================================

/**
 * Return type for useProcessedKarmaTiers hook
 */
export interface UseProcessedKarmaTiersReturn {
  /** Processed karma levels array */
  karmaLevels: KarmaLevel[]
  /** Loading state from the underlying useKarmaTier hook */
  isLoading: boolean
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Custom hook to process karma tier data from the contract into application format
 *
 * This hook fetches karma tiers from the contract using useKarmaTier and transforms
 * them into the KarmaLevel format used throughout the application. It handles:
 * - Transformation from contract format to application format
 * - Memoization to prevent unnecessary recalculation
 *
 * @returns Processed karma levels and loading state
 *
 * @example
 * Basic usage
 * ```tsx
 * function KarmaDisplay() {
 *   const { karmaLevels, isLoading } = useProcessedKarmaTiers()
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       {karmaLevels.map(level => (
 *         <div key={level.level}>
 *           Level {level.level}: {level.minKarma} - {level.maxKarma}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * Finding current level
 * ```tsx
 * function CurrentLevel() {
 *   const { karmaLevels } = useProcessedKarmaTiers()
 *   const currentKarma = 5000
 *
 *   const currentLevel = karmaLevels.find(
 *     level => currentKarma >= level.minKarma && currentKarma < level.maxKarma
 *   )
 *
 *   return <div>Current Level: {currentLevel?.level ?? 1}</div>
 * }
 * ```
 */
export function useProcessedKarmaTiers(): UseProcessedKarmaTiersReturn {
  const { data: tiersData, isLoading } = useKarmaTier()

  const karmaLevels = useMemo<KarmaLevel[]>(() => {
    if (!tiersData?.tiers || tiersData.tiers.length === 0) {
      return []
    }

    return tiersData.tiers.map((tier, index) => ({
      level: index,
      minKarma: BigInt(tier.minKarma),
      maxKarma: BigInt(tier.maxKarma),
    }))
  }, [tiersData])

  return {
    karmaLevels,
    isLoading,
  }
}
