import { ActivityItemSkeleton } from './activity-item-skeleton'

const ActivityListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <ActivityItemSkeleton key={idx} />
      ))}
    </div>
  )
}

export { ActivityListSkeleton }
