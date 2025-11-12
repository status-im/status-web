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
            data-customisation={badge.color}
            key={badgeType}
            className="rounded-20 border border-customisation-50/20 px-2 py-0.5"
          >
            <span className="text-13 font-medium text-customisation-50">
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
