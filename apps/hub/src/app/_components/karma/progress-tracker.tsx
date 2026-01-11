import { formatEther } from 'viem'

import { PROGRESS_BAR_DOT_INSET } from '~constants/karma'

import type { KarmaLevel } from '~types/karma'

type ProgressBarProps = {
  currentKarma?: bigint
  karmaLevels: KarmaLevel[]
}

const ProgressBar = ({ currentKarma = 0n, karmaLevels }: ProgressBarProps) => {
  const formatKarmaLabel = (karma: bigint, level: number) => {
    const karmaNum = Number(formatEther(karma))

    if (level < 4) {
      if (level === 0) return '0'
      if (level === 1) return '1'
      if (level === 2) return '1+'
      if (level === 3) return '50+'
      if (level === 4) return '500+'
    } else if (level >= 4 && level < 8) {
      if (level === 4) return '500+'
      if (level === 5) return '5K+'
      if (level === 6) return '20K+'
      if (level === 7) return '100K+'
      if (level === 8) return '500K+'
    } else if (level >= 8 && level <= 10) {
      if (level === 8) return '500K+'
      if (level === 9) return '5M+'
      if (level === 10) return '10M+'
    }

    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    })

    return formatter.format(karmaNum)
  }

  if (karmaLevels.length === 0) {
    return null
  }

  const currentLevelData = getCurrentLevelData(currentKarma, karmaLevels)
  const { level, minKarma, maxKarma } = currentLevelData

  const visibleLevels = getVisibleLevelsByStage(karmaLevels, level)

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

  let desktopLevelProgress: number
  if (level >= 10) {
    desktopLevelProgress = 50
  } else {
    desktopLevelProgress = Math.min(
      100,
      oneLevelPercentage * currentLevelIndexInVisible +
        oneLevelPercentage * (levelProgress / 100)
    )
  }

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
        <div
          className={`flex items-center gap-0.5 rounded-6 px-1.5 ${
            mobileStartLevel === level ? 'bg-purple' : 'bg-neutral-5'
          }`}
        >
          <span
            className={`text-13 font-medium ${
              mobileStartLevel === level ? 'text-white-100' : 'text-neutral-50'
            }`}
          >
            lv
          </span>
          <span
            className={`text-15 font-medium ${
              mobileStartLevel === level ? 'text-white-100' : 'text-neutral-100'
            }`}
          >
            {mobileStartLevel}
          </span>
        </div>
        <div
          className={`flex items-center gap-0.5 rounded-6 px-1.5 ${
            mobileEndLevel === level ? 'bg-purple' : 'bg-neutral-5'
          }`}
        >
          <span
            className={`text-13 font-medium ${
              mobileEndLevel === level ? 'text-white-100' : 'text-neutral-50'
            }`}
          >
            lv
          </span>
          <span
            className={`text-15 font-medium ${
              mobileEndLevel === level ? 'text-white-100' : 'text-neutral-100'
            }`}
          >
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
                <div
                  className={`flex items-center gap-1 rounded-6 px-3 ${
                    lvl.level === level ? 'bg-purple' : 'bg-neutral-5'
                  }`}
                >
                  <span
                    className={`text-13 font-medium ${
                      lvl.level === level ? 'text-white-100' : 'text-neutral-50'
                    }`}
                  >
                    lv
                    <span
                      className={`text-15 font-medium ${
                        lvl.level === level
                          ? 'text-white-100'
                          : 'text-neutral-100'
                      }`}
                    >
                      {lvl.level}
                    </span>
                  </span>
                </div>
                <span className="text-center text-13 font-medium text-neutral-50">
                  {formatKarmaLabel(lvl.minKarma, lvl.level)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Karma Labels - Mobile */}
      <div className="flex w-full justify-between md:hidden">
        <span className="text-13 font-medium text-neutral-50">
          {formatKarmaLabel(mobileMilestones[0], mobileStartLevel)}
        </span>
        <span className="text-13 font-medium text-neutral-50">
          {formatKarmaLabel(mobileMilestones[1], mobileEndLevel)}
        </span>
      </div>
    </div>
  )
}

const getVisibleLevelsByStage = (
  allLevels: KarmaLevel[],
  currentLevel: number
): KarmaLevel[] => {
  if (allLevels.length === 0) {
    return []
  }

  if (currentLevel < 4) {
    return allLevels.slice(0, Math.min(5, allLevels.length))
  } else if (currentLevel >= 4 && currentLevel < 8) {
    const startIndex = Math.min(4, allLevels.length - 1)
    const endIndex = Math.min(9, allLevels.length)
    return allLevels.slice(startIndex, endIndex)
  } else if (currentLevel >= 8 && currentLevel <= 10) {
    const startIndex = Math.min(8, allLevels.length - 1)
    const endIndex = Math.min(11, allLevels.length)
    return allLevels.slice(startIndex, endIndex)
  } else {
    const level10Index = Math.min(10, allLevels.length - 1)
    return [allLevels[level10Index]]
  }
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
