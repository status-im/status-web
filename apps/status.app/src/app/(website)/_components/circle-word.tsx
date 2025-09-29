import { cx } from 'class-variance-authority'

import { Image } from '~components/assets'

import type { ImageId } from '~components/assets'

export const CircleWord = ({
  children,
  imageId,
  className,
}: {
  children: React.ReactNode
  imageId: ImageId
  className?: string
}) => (
  <span className="relative inline-flex w-max">
    <span className={cx('absolute left-[-6%] top-[-10%] w-[110%]', className)}>
      <Image id={imageId} alt="" aria-hidden />
    </span>
    {children}
  </span>
)
