import { KARMA_LEVELS, PROGRESS_BAR_DOT_INSET } from '~constants/karma'

import type { KarmaLevel } from '~types/karma'

type ProgressBarProps = {
  currentKarma?: number
}

const ProgressBar = ({ currentKarma = 0 }: ProgressBarProps) => {
  const formatKarmaLabel = (karma: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    })
    return formatter.format(karma)
  }

  // Find current level
  const currentLevelData =
    KARMA_LEVELS.find(
      level => currentKarma >= level.minKarma && currentKarma < level.maxKarma
    ) || KARMA_LEVELS[KARMA_LEVELS.length - 1]

  const currentLevel = currentLevelData.level

  // Calculate progress within current level
  let levelProgress = 0

  if (currentLevel != 0) {
    levelProgress =
      currentLevelData.maxKarma === Infinity
        ? 100
        : ((currentKarma - currentLevelData.minKarma) /
            (currentLevelData.maxKarma - currentLevelData.minKarma)) *
          100
  }

  const oneLevelPercentage = 100 / KARMA_LEVELS.length
  const desktopLevelProgress = Math.min(
    100,
    oneLevelPercentage * currentLevel +
      oneLevelPercentage * (levelProgress / 100)
  )

  // For mobile: show only previous and current level
  const mobileStartLevel = Math.max(1, currentLevel - 1)
  const mobileEndLevel = Math.min(KARMA_LEVELS.length, currentLevel)

  // Mobile: only show current and next milestone
  const mobileMilestones = [
    KARMA_LEVELS[mobileStartLevel - 1]?.minKarma ?? 0,
    KARMA_LEVELS[mobileEndLevel - 1]?.maxKarma ?? 0,
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
        {KARMA_LEVELS.slice(1).map((level, index) => {
          // Use even spacing for dots to align with level labels
          const actualIndex = index + 1 // Account for slice(1)
          const evenSpacing =
            KARMA_LEVELS.length > 1
              ? (actualIndex / (KARMA_LEVELS.length - 1)) * 100
              : 50

          let position = evenSpacing

          // Inset edge dots so they appear inside the rounded progress bar
          if (position <= 0) {
            position = PROGRESS_BAR_DOT_INSET.START
          } else if (position >= 100) {
            position = PROGRESS_BAR_DOT_INSET.END
          }

          const isReached = currentKarma >= level.minKarma

          return (
            <div
              key={`milestone-dot-${index}`}
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
        {KARMA_LEVELS.map((level, index) => {
          // Use same even spacing as level labels
          const evenSpacing =
            KARMA_LEVELS.length > 1
              ? (index / (KARMA_LEVELS.length - 1)) * 100
              : 50

          return (
            <div
              key={`karma-label-${index}`}
              className={`flex items-center ${
                index === 0
                  ? 'justify-start'
                  : index === KARMA_LEVELS.length - 1
                    ? 'justify-end'
                    : 'justify-center'
              }`}
              style={{
                position:
                  index === 0 || index === KARMA_LEVELS.length - 1
                    ? 'relative'
                    : 'absolute',
                left:
                  index > 0 && index < KARMA_LEVELS.length - 1
                    ? `${evenSpacing}%`
                    : undefined,
                transform:
                  index > 0 && index < KARMA_LEVELS.length - 1
                    ? 'translateX(-50%)'
                    : undefined,
                width:
                  index > 0 && index < KARMA_LEVELS.length - 1
                    ? '110px'
                    : 'auto',
              }}
            >
              <div className="flex flex-col justify-center gap-0.5">
                <div className="flex items-center gap-1 rounded-6 bg-neutral-5 px-3">
                  <span className="text-13 font-medium text-neutral-50">
                    lv
                    <span className="text-15 font-medium text-neutral-100">
                      {level.level}
                    </span>
                  </span>
                </div>
                <span className="text-center text-13 font-medium text-neutral-50">
                  {formatKarmaLabel(level.minKarma)}
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

const getCurrentLevelData = (
  karma: number,
  levels: KarmaLevel[] = []
): KarmaLevel => {
  return (
    levels.find(level => karma >= level.minKarma && karma < level.maxKarma) ||
    levels[levels.length - 1]
  )
}

export { getCurrentLevelData, ProgressBar }
export type { ProgressBarProps }
