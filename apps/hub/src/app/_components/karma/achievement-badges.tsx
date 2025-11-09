import { ACHIEVEMENT_BADGE_TYPES } from '~constants/karma'

import type { AchievementBadgeType } from '~types/karma'

type AchievementBadgesProps = {
  badges: AchievementBadgeType[]
}

const AchievementBadges = ({ badges }: AchievementBadgesProps) => {
  return (
    <div className="flex size-full flex-wrap items-center gap-2">
      {badges.map(badgeType => {
        const badge = ACHIEVEMENT_BADGE_TYPES[badgeType]
        return (
          <div
            key={badgeType}
            className="rounded-20 border px-2 py-0.5"
            style={{
              borderColor: badge.borderColor,
            }}
          >
            <span
              className="text-13 font-medium"
              style={{
                color: badge.color,
              }}
            >
              {badge.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { AchievementBadges }
export type { AchievementBadgesProps }
