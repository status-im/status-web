import { useMemo } from 'react'

import { KARMA_LEVELS } from '~constants/karma'
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
 * - Validation of tier data (checking for NaN values, negative karma, etc.)
 * - Transformation from contract format to application format
 * - Fallback to KARMA_LEVELS constant when contract data is unavailable
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
  const { data: karmaTierData, isLoading: tiersLoading } = useKarmaTier()

  const karmaLevels = useMemo<KarmaLevel[]>(() => {
    if (!karmaTierData || karmaTierData.count === 0 || !karmaTierData.tiers) {
      return KARMA_LEVELS
    }

    const processedTiers = karmaTierData.tiers
      .map((tier, index) => {
        const minKarma = Number(tier.minKarma)
        const maxKarma = Number(tier.maxKarma)
        const level = index + 1

        // Skip invalid tiers
        if (
          isNaN(minKarma) ||
          isNaN(maxKarma) ||
          isNaN(level) ||
          minKarma < 0
        ) {
          console.warn('Skipping invalid tier:', { tier, index, level })
          return null
        }

        return {
          level,
          minKarma,
          maxKarma: index === karmaTierData.count - 1 ? Infinity : maxKarma,
        }
      })
      .filter((tier): tier is KarmaLevel => tier !== null)

    // Only use processed tiers if we got valid results
    if (processedTiers.length > 0) {
      return processedTiers
    }

    console.warn('No valid tiers found, using fallback KARMA_LEVELS')
    return KARMA_LEVELS
  }, [karmaTierData])

  return {
    karmaLevels,
    isLoading: tiersLoading,
  }
}
