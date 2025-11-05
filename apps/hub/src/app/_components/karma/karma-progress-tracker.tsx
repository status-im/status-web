import {
  KARMA_LEVEL_BOUNDS,
  KARMA_LEVELS,
  PROGRESS_BAR_DOT_COLORS,
  PROGRESS_BAR_DOT_INSET,
} from '~constants/karma'

import type { KarmaLevel } from '~types/karma'

type ProgressBarProps = {
  currentKarma?: number
}

const ProgressBar = ({ currentKarma = 0 }: ProgressBarProps) => {
  const formatKarma = (karma: number) => {
    return karma.toLocaleString('en-US')
  }

  // Find current level
  const currentLevelData =
    KARMA_LEVELS.find(
      level => currentKarma >= level.minKarma && currentKarma < level.maxKarma
    ) || KARMA_LEVELS[KARMA_LEVELS.length - 1]

  const currentLevel = currentLevelData.level

  // Calculate progress within current level
  const levelProgress =
    currentLevelData.maxKarma === Infinity
      ? 100
      : ((currentKarma - currentLevelData.minKarma) /
          (currentLevelData.maxKarma - currentLevelData.minKarma)) *
        100

  // For mobile: show only previous and current level
  const mobileStartLevel = Math.max(KARMA_LEVEL_BOUNDS.MIN, currentLevel - 1)
  const mobileEndLevel = Math.min(KARMA_LEVEL_BOUNDS.MAX, currentLevel)

  // Desktop: all milestones - dynamically derived from KARMA_LEVELS
  const desktopMilestones = [
    ...new Set([
      ...KARMA_LEVELS.map(level => level.minKarma),
      ...KARMA_LEVELS.filter(level => level.maxKarma !== Infinity).map(
        level => level.maxKarma
      ),
    ]),
  ].sort((a, b) => a - b)

  // Maximum karma for calculations (last finite maxKarma value)
  const maxKarma = Math.max(
    ...KARMA_LEVELS.filter(level => level.maxKarma !== Infinity).map(
      level => level.maxKarma
    )
  )

  // Mobile: only show current and next milestone
  const mobileMilestones = [
    KARMA_LEVELS[mobileStartLevel - 1].minKarma,
    KARMA_LEVELS[mobileEndLevel - 1].maxKarma,
  ]

  return (
    <div className="flex w-full flex-col gap-2">
      {/* Progress Bar - Desktop */}
      <div className="relative hidden h-3 w-full rounded-20 bg-neutral-5 md:block">
        {/* Progress Fill - fills from 0 to current karma position */}
        <div
          className="h-full rounded-20 bg-purple transition-all duration-300"
          style={{
            width: `${Math.min((currentKarma / maxKarma) * 100, 100)}%`,
          }}
        />

        {/* Step Indicators at each milestone except first */}
        {desktopMilestones.slice(1).map(milestone => {
          let position = (milestone / maxKarma) * 100

          // Inset edge dots so they appear inside the rounded progress bar
          if (position <= 0) {
            position = PROGRESS_BAR_DOT_INSET.START
          } else if (position >= 100) {
            position = PROGRESS_BAR_DOT_INSET.END
          }

          const isReached = currentKarma >= milestone

          return (
            <div
              key={milestone}
              className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300"
              style={{
                left: `${position}%`,
                backgroundColor: isReached
                  ? PROGRESS_BAR_DOT_COLORS.REACHED
                  : PROGRESS_BAR_DOT_COLORS.UNREACHED,
              }}
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
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${PROGRESS_BAR_DOT_INSET.END}%`,
            backgroundColor: PROGRESS_BAR_DOT_COLORS.UNREACHED,
          }}
        />
      </div>

      {/* Level Labels - Desktop */}
      <div className="relative hidden w-full justify-between md:flex">
        {KARMA_LEVELS.map((level, index) => (
          <div
            key={level.level}
            className={`flex items-center gap-0.5 rounded-6 bg-neutral-5 px-1.5 ${
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
                  ? `${(level.minKarma / maxKarma) * 100}%`
                  : undefined,
              transform:
                index > 0 && index < KARMA_LEVELS.length - 1
                  ? 'translateX(-50%)'
                  : undefined,
            }}
          >
            <span className="text-13 font-medium text-neutral-50">lv</span>
            <span className="text-15 font-medium text-neutral-100">
              {level.level}
            </span>
          </div>
        ))}
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
        {desktopMilestones.map((milestone, index) => (
          <div
            key={milestone}
            className={`flex items-center ${
              index === 0
                ? 'justify-start'
                : index === desktopMilestones.length - 1
                  ? 'justify-end'
                  : 'justify-center'
            }`}
            style={{
              position:
                index === 0 || index === desktopMilestones.length - 1
                  ? 'relative'
                  : 'absolute',
              left:
                index > 0 && index < desktopMilestones.length - 1
                  ? `${(milestone / maxKarma) * 100}%`
                  : undefined,
              transform:
                index > 0 && index < desktopMilestones.length - 1
                  ? 'translateX(-50%)'
                  : undefined,
              width:
                index > 0 && index < desktopMilestones.length - 1
                  ? '110px'
                  : 'auto',
            }}
          >
            <span className="text-13 font-medium text-neutral-50">
              {formatKarma(milestone)}
            </span>
          </div>
        ))}
      </div>

      {/* Karma Labels - Mobile */}
      <div className="flex w-full justify-between md:hidden">
        <span className="text-13 font-medium text-neutral-50">
          {formatKarma(mobileMilestones[0])}
        </span>
        <span className="text-13 font-medium text-neutral-50">
          {formatKarma(mobileMilestones[1])}
        </span>
      </div>
    </div>
  )
}

const getCurrentLevelData = (karma: number): KarmaLevel => {
  return (
    KARMA_LEVELS.find(
      level => karma >= level.minKarma && karma < level.maxKarma
    ) || KARMA_LEVELS[KARMA_LEVELS.length - 1]
  )
}

export { getCurrentLevelData, ProgressBar }
export type { ProgressBarProps }
