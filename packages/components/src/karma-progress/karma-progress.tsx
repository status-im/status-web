import { formatEther, parseEther } from 'viem'

export interface KarmaLevel {
  level: number
  minKarma: bigint
  maxKarma: bigint
}

export type KarmaProgressBarProps = {
  currentKarma?: bigint
  karmaLevels: KarmaLevel[]
  formatKarma?: (amount: string) => string
}

const PROGRESS_BAR_DOT_INSET = {
  START: 0.1,
  END: 99,
} as const

const KARMA_THRESHOLDS = {
  LEVEL_10_MIN: parseEther('10000000'),
  LEVEL_10_MAX: parseEther('100000000'),
} as const

const getVisibleLevelsByStage = (
  allLevels: KarmaLevel[],
  currentLevel: number,
): KarmaLevel[] => {
  if (allLevels.length === 0) {
    return []
  }

  const getRange = (start: number, end: number) => {
    const startIndex = Math.min(start, allLevels.length - 1)
    const endIndex = Math.min(end, allLevels.length)

    return allLevels.slice(startIndex, endIndex)
  }

  switch (true) {
    case currentLevel < 4:
      return getRange(0, 5)
    case currentLevel < 8:
      return getRange(4, 9)
    case currentLevel < 10:
      return getRange(8, 11)
    default: {
      const level10Index = Math.min(10, allLevels.length - 1)
      return [allLevels[level10Index]]
    }
  }
}

export const getCurrentLevelData = (
  karma: bigint,
  levels: KarmaLevel[],
): KarmaLevel => {
  const defaultLevel: KarmaLevel = { level: 0, minKarma: 0n, maxKarma: 0n }

  if (levels.length === 0) {
    return defaultLevel
  }

  if (karma === 0n) {
    return levels[0]
  }

  // Special case: 1 karma = Level 1
  if (karma === parseEther('1')) {
    return levels[1] || levels[0]
  }

  // Find the matching level from highest to lowest
  // This ensures that boundary values (e.g., 50, 500) match the higher level
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i]
    if (karma >= level.minKarma && karma <= level.maxKarma) {
      return level
    }
  }

  // If no match found, return the highest level
  return levels[levels.length - 1]
}

const LEVEL_LABELS: Record<number, string> = {
  0: '0',
  1: '1',
  2: '1+',
  3: '50+',
  4: '500+',
  5: '5K+',
  6: '20K+',
  7: '100K+',
  8: '500K+',
  9: '5M+',
  10: '10M+',
}

const formatKarmaLabel = (karma: bigint, level: number) => {
  if (level in LEVEL_LABELS) {
    return LEVEL_LABELS[level]
  }

  const karmaNum = Number(formatEther(karma))

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  })

  return formatter.format(karmaNum)
}

export const KarmaProgressBar = ({
  currentKarma = 0n,
  karmaLevels,
  formatKarma,
}: KarmaProgressBarProps) => {
  if (karmaLevels.length === 0) {
    return null
  }

  const currentLevelData = getCurrentLevelData(currentKarma, karmaLevels)

  const { level, minKarma, maxKarma } = currentLevelData

  const visibleLevels = getVisibleLevelsByStage(karmaLevels, level)

  const currentLevelIndexInVisible = Math.max(
    0,
    visibleLevels.findIndex(l => l.level === level),
  )

  let levelProgress = 0

  if (level >= 10) {
    const level10MinKarma =
      karmaLevels[10]?.minKarma ?? KARMA_THRESHOLDS.LEVEL_10_MIN
    const level10MaxKarma = KARMA_THRESHOLDS.LEVEL_10_MAX
    const range = level10MaxKarma - level10MinKarma

    if (range === 0n) {
      levelProgress = currentKarma >= level10MinKarma ? 100 : 0
    } else {
      levelProgress = Number(
        ((currentKarma - level10MinKarma) * 100n) / (range > 0n ? range : 1n),
      )
      levelProgress = Math.min(100, Math.max(0, levelProgress))
    }
  } else if (level === 0) {
    const nextLevel = karmaLevels[1]
    if (nextLevel) {
      const range = nextLevel.minKarma - minKarma

      levelProgress =
        range === 0n
          ? 0
          : Number(
              ((currentKarma - minKarma) * 100n) / (range > 0n ? range : 1n),
            )
    }
  } else {
    const range = maxKarma - minKarma
    levelProgress =
      range === 0n
        ? 0
        : Number(((currentKarma - minKarma) * 100n) / (range > 0n ? range : 1n))
  }

  const oneLevelPercentage = 100 / Math.max(visibleLevels.length - 1, 1)

  let desktopLevelProgress: number

  if (level >= 10) {
    const level10 = karmaLevels[10]
    const level10MinKarma = level10?.minKarma ?? KARMA_THRESHOLDS.LEVEL_10_MIN
    const level10MaxKarma = KARMA_THRESHOLDS.LEVEL_10_MAX

    const range = level10MaxKarma - level10MinKarma

    if (range === 0n) {
      desktopLevelProgress = currentKarma >= level10MinKarma ? 100 : 0
    } else {
      const progress = Number(
        ((currentKarma - level10MinKarma) * 100n) / (range > 0n ? range : 1n),
      )
      desktopLevelProgress = Math.min(100, Math.max(0, progress))
    }
  } else {
    desktopLevelProgress = Math.min(
      100,
      oneLevelPercentage * currentLevelIndexInVisible +
        oneLevelPercentage * (levelProgress / 100),
    )
  }

  const mobileStartLevel = Math.max(0, level)
  const mobileEndLevel = Math.min(karmaLevels.length - 1, level + 1)

  const mobileMilestones = [
    karmaLevels[mobileStartLevel]?.minKarma ?? 0n,
    karmaLevels[mobileEndLevel]?.minKarma ?? 0n,
  ]

  const karmaEther = formatEther(currentKarma)
  const formattedKarma = formatKarma
    ? formatKarma(karmaEther)
    : (() => {
        const num = Number(karmaEther)
        const formatter = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        return formatter.format(num)
      })()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-baseline gap-1.5">
        <span className="text-27 font-semibold text-neutral-100">
          {formattedKarma}
        </span>
        <span className="text-15 font-medium uppercase text-neutral-50">
          Karma
        </span>
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="relative hidden h-3 w-full rounded-20 bg-neutral-5 md:block">
          {/* prettier-ignore */}
          <div
            className="bg-purple h-2.5 rounded-20 transition-all duration-300"
            style={{
              width: `${desktopLevelProgress}%`,
            }}
          />

          {visibleLevels.map((lvl, index) => {
            const evenSpacing =
              visibleLevels.length > 1
                ? (index / (visibleLevels.length - 1)) * 100
                : 50

            const isLastLevel = index === visibleLevels.length - 1
            const isFirstLevel = index === 0

            let position = evenSpacing

            if (isLastLevel) {
              position = 100
            } else if (position <= 0) {
              position = PROGRESS_BAR_DOT_INSET.START
            } else if (position >= 100) {
              position = PROGRESS_BAR_DOT_INSET.END
            }

            const isReached = currentKarma > lvl.minKarma
            const isExactThreshold = currentKarma === lvl.minKarma

            const isHidden = !isLastLevel && desktopLevelProgress >= position

            const getTransformClass = () => {
              if (isFirstLevel) return 'translate-x-[calc(-50%+6px)]'
              if (isLastLevel) return ''
              return ''
            }

            const getStyle = () => {
              if (isLastLevel) {
                return { right: '3px' }
              }
              return { left: `${position}%` }
            }

            return (
              <div
                key={`milestone-dot-${lvl.level}`}
                className={`absolute top-1/2 size-2 ${isLastLevel ? '' : '-translate-x-1/2'} -translate-y-1/2 rounded-full transition-colors duration-300 ${getTransformClass()} ${
                  isHidden
                    ? 'hidden'
                    : isExactThreshold || !isReached
                      ? 'bg-neutral-80/20'
                      : 'bg-purple'
                }`}
                style={getStyle()}
              />
            )
          })}
        </div>

        <div className="relative h-3 w-full rounded-20 bg-neutral-5 md:hidden">
          {/* prettier-ignore */}
          <div
            className="bg-purple h-full rounded-20 transition-all duration-300"
            style={{ width: `${levelProgress}%` }}
          />

          <div
            className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-neutral-80/20"
            style={{ right: '3px' }}
          />
        </div>

        <div className="flex w-full justify-between md:hidden">
          <div
            className={`flex w-fit items-center gap-0.5 rounded-6 px-1.5 ${
              mobileStartLevel === level ? 'bg-purple' : 'bg-neutral-5'
            }`}
          >
            <span
              className={`text-13 font-medium ${
                mobileStartLevel === level
                  ? 'text-white-100'
                  : 'text-neutral-50'
              }`}
            >
              lv
            </span>
            <span
              className={`text-15 font-medium ${
                mobileStartLevel === level
                  ? 'text-white-100'
                  : 'text-neutral-100'
              }`}
            >
              {mobileStartLevel}
            </span>
          </div>
          {level < 10 && (
            <div
              className={`flex items-center gap-0.5 rounded-6 px-1.5 ${
                mobileEndLevel === level ? 'bg-purple' : 'bg-neutral-5'
              }`}
            >
              <span
                className={`text-13 font-medium ${
                  mobileEndLevel === level
                    ? 'text-white-100'
                    : 'text-neutral-50'
                }`}
              >
                lv
              </span>
              <span
                className={`text-15 font-medium ${
                  mobileEndLevel === level
                    ? 'text-white-100'
                    : 'text-neutral-100'
                }`}
              >
                {mobileEndLevel}
              </span>
            </div>
          )}
        </div>

        <div
          className={`relative hidden w-full md:flex ${
            level >= 10 && visibleLevels.length === 1
              ? 'justify-start'
              : 'justify-between'
          }`}
        >
          {visibleLevels.map((lvl, index) => {
            const isLevel10OrAbove = level >= 10 && visibleLevels.length === 1

            const evenSpacing =
              visibleLevels.length > 1
                ? (index / (visibleLevels.length - 1)) * 100
                : isLevel10OrAbove
                  ? 0
                  : 50

            return (
              <div
                key={`karma-label-${lvl.level}`}
                className={`flex items-center ${
                  isLevel10OrAbove
                    ? 'justify-start'
                    : index === 0
                      ? 'justify-start'
                      : index === visibleLevels.length - 1
                        ? 'justify-end'
                        : 'justify-center'
                }`}
                style={{
                  position: isLevel10OrAbove
                    ? 'relative'
                    : index === 0 || index === visibleLevels.length - 1
                      ? 'relative'
                      : 'absolute',
                  left: isLevel10OrAbove
                    ? undefined
                    : index > 0 && index < visibleLevels.length - 1
                      ? `${evenSpacing}%`
                      : undefined,
                  transform: isLevel10OrAbove
                    ? undefined
                    : index > 0 && index < visibleLevels.length - 1
                      ? 'translateX(-50%)'
                      : undefined,
                  width: isLevel10OrAbove
                    ? 'auto'
                    : index > 0 && index < visibleLevels.length - 1
                      ? '110px'
                      : 'auto',
                }}
              >
                <div className="flex flex-col justify-center gap-0.5">
                  <div
                    className={`flex w-fit items-center rounded-6 px-1.5 ${
                      lvl.level === level ? 'bg-purple' : 'bg-neutral-5'
                    }`}
                  >
                    <span
                      className={`flex items-baseline gap-0.5 ${
                        lvl.level === level
                          ? 'text-white-100'
                          : 'text-neutral-50'
                      }`}
                    >
                      <span
                        className={`text-13 font-medium ${lvl.level === level ? 'text-white-100' : 'text-neutral-50'}`}
                      >
                        lv
                      </span>
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

        <div className="flex w-full justify-between md:hidden">
          <span className="text-13 font-medium text-neutral-50">
            {formatKarmaLabel(mobileMilestones[0], mobileStartLevel)}
          </span>
          {level < 10 && (
            <span className="text-13 font-medium text-neutral-50">
              {formatKarmaLabel(mobileMilestones[1], mobileEndLevel)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
