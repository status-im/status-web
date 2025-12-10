import { formatEther } from 'viem'

import { PROGRESS_BAR_DOT_INSET } from '~constants/karma'

import type { KarmaLevel } from '~types/karma'

const VISIBLE_LEVELS_COUNT = 6

type ProgressBarProps = {
  currentKarma?: bigint
  karmaLevels: KarmaLevel[]
}

const ProgressBar = ({ currentKarma = 0n, karmaLevels }: ProgressBarProps) => {
  const formatKarmaLabel = (karma: bigint) => {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    })

    return formatter.format(Number(formatEther(karma)))
  }

  if (karmaLevels.length === 0) {
    return null
  }

  const currentLevelData = getCurrentLevelData(currentKarma, karmaLevels)
  const { level, minKarma, maxKarma } = currentLevelData

  const visibleLevels = getVisibleLevels(
    karmaLevels,
    level,
    VISIBLE_LEVELS_COUNT
  )

  const currentLevelIndexInVisible = Math.max(
    0,
    visibleLevels.findIndex(l => l.level === level)
  )

  let levelProgress = 0
  if (level !== 0) {
    const range = maxKarma - minKarma
    levelProgress =
      range === 0n
        ? 0
        : Number(((currentKarma - minKarma) * 100n) / (range > 0n ? range : 1n))
  }

  const oneLevelPercentage = 100 / Math.max(visibleLevels.length - 1, 1)
  const desktopLevelProgress = Math.min(
    100,
    oneLevelPercentage * currentLevelIndexInVisible +
      oneLevelPercentage * (levelProgress / 100)
  )

  const mobileStartLevel = Math.max(0, level)
  const mobileEndLevel = Math.min(karmaLevels.length - 1, level + 1)

  // Mobile: only show current and next milestone
  const mobileMilestones = [
    karmaLevels[mobileStartLevel]?.minKarma ?? 0n,
    karmaLevels[mobileEndLevel]?.minKarma ?? 0n,
  ]

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Progress Bar - Desktop */}
      <div className="relative hidden h-3 w-full rounded-20 bg-neutral-5 md:block">
        {/* Progress Fill - fills from 0 to current karma position */}
        <div
          className="h-full rounded-20 bg-purple transition-all duration-300"
          style={{
            width: `${desktopLevelProgress}%`,
          }}
        />

        {/* Step Indicators at each milestone except first */}
        {visibleLevels.slice(1).map((lvl, index) => {
          // Use even spacing for dots to align with level labels
          const actualIndex = index + 1 // Account for slice(1)
          const evenSpacing =
            visibleLevels.length > 1
              ? (actualIndex / (visibleLevels.length - 1)) * 100
              : 50

          let position = evenSpacing

          // Inset edge dots so they appear inside the rounded progress bar
          if (position <= 0) {
            position = PROGRESS_BAR_DOT_INSET.START
          } else if (position >= 100) {
            position = PROGRESS_BAR_DOT_INSET.END
          }

          const isReached = currentKarma >= lvl.minKarma

          return (
            <div
              key={`milestone-dot-${lvl.level}`}
              className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 ${
                isReached ? 'bg-purple' : 'bg-neutral-80/20'
              }`}
              style={{ left: `${position}%` }}
            />
          )
        })}
      </div>

      {/* Progress Bar - Mobile */}
      <div className="relative h-3 w-full rounded-20 bg-neutral-5 md:hidden">
        {/* Progress Fill */}
        <div
          className="h-full rounded-20 bg-purple transition-all duration-300"
          style={{ width: `${levelProgress}%` }}
        />

        {/* End dot for mobile - inset from edge */}
        <div
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-80/20"
          style={{ left: `${PROGRESS_BAR_DOT_INSET.END}%` }}
        />
      </div>

      {/* Level Labels - Mobile */}
      <div className="flex w-full justify-between md:hidden">
        <div className="flex items-center gap-0.5 rounded-6 bg-neutral-5 px-1.5">
          <span className="text-13 font-medium text-neutral-50">lv</span>
          <span className="text-15 font-medium text-neutral-100">
            {mobileStartLevel}
          </span>
        </div>
        <div className="flex items-center gap-0.5 rounded-6 bg-neutral-5 px-1.5">
          <span className="text-13 font-medium text-neutral-50">lv</span>
          <span className="text-15 font-medium text-neutral-100">
            {mobileEndLevel}
          </span>
        </div>
      </div>

      {/* Karma Labels - Desktop */}
      <div className="relative hidden w-full justify-between md:flex">
        {visibleLevels.map((lvl, index) => {
          // Use same even spacing as level labels
          const evenSpacing =
            visibleLevels.length > 1
              ? (index / (visibleLevels.length - 1)) * 100
              : 50

          return (
            <div
              key={`karma-label-${lvl.level}`}
              className={`flex items-center ${
                index === 0
                  ? 'justify-start'
                  : index === visibleLevels.length - 1
                    ? 'justify-end'
                    : 'justify-center'
              }`}
              style={{
                position:
                  index === 0 || index === visibleLevels.length - 1
                    ? 'relative'
                    : 'absolute',
                left:
                  index > 0 && index < visibleLevels.length - 1
                    ? `${evenSpacing}%`
                    : undefined,
                transform:
                  index > 0 && index < visibleLevels.length - 1
                    ? 'translateX(-50%)'
                    : undefined,
                width:
                  index > 0 && index < visibleLevels.length - 1
                    ? '110px'
                    : 'auto',
              }}
            >
              <div className="flex flex-col justify-center gap-0.5">
                <div className="flex items-center gap-1 rounded-6 bg-neutral-5 px-3">
                  <span className="text-13 font-medium text-neutral-50">
                    lv
                    <span className="text-15 font-medium text-neutral-100">
                      {lvl.level}
                    </span>
                  </span>
                </div>
                <span className="text-center text-13 font-medium text-neutral-50">
                  {formatKarmaLabel(lvl.minKarma)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Karma Labels - Mobile */}
      <div className="flex w-full justify-between md:hidden">
        <span className="text-13 font-medium text-neutral-50">
          {formatKarmaLabel(mobileMilestones[0])}
        </span>
        <span className="text-13 font-medium text-neutral-50">
          {formatKarmaLabel(mobileMilestones[1])}
        </span>
      </div>
    </div>
  )
}

const getVisibleLevels = (
  allLevels: KarmaLevel[],
  currentLevel: number,
  visibleCount: number
): KarmaLevel[] => {
  if (allLevels.length <= visibleCount) {
    return allLevels
  }

  const halfWindow = Math.floor(visibleCount / 2)
  const maxStartIndex = allLevels.length - visibleCount

  let startIndex: number

  if (currentLevel < halfWindow) {
    startIndex = 0
  } else if (currentLevel >= allLevels.length - halfWindow) {
    startIndex = maxStartIndex
  } else {
    startIndex = currentLevel - halfWindow
  }

  return allLevels.slice(startIndex, startIndex + visibleCount)
}

const getCurrentLevelData = (
  karma: bigint,
  levels: KarmaLevel[]
): KarmaLevel => {
  const defaultLevel: KarmaLevel = { level: 0, minKarma: 0n, maxKarma: 0n }

  if (levels.length === 0) {
    return defaultLevel
  }

  if (karma === 0n) {
    return levels[0]
  }

  return (
    levels.find(level => karma >= level.minKarma && karma <= level.maxKarma) ||
    levels[levels.length - 1]
  )
}

export { getCurrentLevelData, ProgressBar }
export type { ProgressBarProps }
