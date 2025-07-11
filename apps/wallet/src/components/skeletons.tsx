import { Skeleton } from '@status-im/components'

const AccountSkeleton = ({
  variant = 'primary',
}: {
  variant?: 'primary' | 'secondary'
}) => (
  <div className="flex items-center gap-1.5">
    <Skeleton height={27} width={27} className="rounded-10" variant={variant} />
    <Skeleton height={16} width={73} className="rounded-10" variant={variant} />
  </div>
)

const ActionButtonsSkeleton = () => (
  <div className="flex items-center gap-1.5">
    <Skeleton
      height={32}
      width={70}
      className="rounded-10"
      variant="secondary"
    />
    <Skeleton
      height={32}
      width={105}
      className="rounded-10"
      variant="secondary"
    />
    <Skeleton
      height={32}
      width={75}
      className="rounded-10"
      variant="secondary"
    />
  </div>
)

const BalanceSkeleton = ({
  variant = 'primary',
}: {
  variant?: 'primary' | 'secondary'
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1">
      <Skeleton
        height={27}
        width={73}
        className="rounded-10"
        variant={variant}
      />
      <Skeleton
        height={16}
        width={16}
        className="rounded-10"
        variant={variant}
      />
    </div>
    <div className="flex items-center gap-1">
      <Skeleton
        height={12}
        width={40}
        className="rounded-10"
        variant={variant}
      />
      <Skeleton
        height={12}
        width={26}
        className="rounded-10"
        variant={variant}
      />
      <Skeleton
        height={12}
        width={34}
        className="rounded-10"
        variant={variant}
      />
    </div>
  </div>
)

const TabsSkeleton = () => (
  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
    <Skeleton
      height={32}
      width={70}
      className="rounded-10"
      variant="secondary"
    />
    <Skeleton
      height={32}
      width={105}
      className="rounded-10"
      variant="secondary"
    />
    <Skeleton
      height={32}
      width={105}
      className="rounded-10"
      variant="secondary"
    />
  </div>
)

export { AccountSkeleton, ActionButtonsSkeleton, BalanceSkeleton, TabsSkeleton }
