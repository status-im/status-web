import { cx } from 'class-variance-authority'

import { Image } from '~components/assets'

type Props = {
  className?: string
  children?: React.ReactNode
}

export const ScreenBackground = (props: Props) => {
  const { className, children } = props

  return (
    <div
      className={cx(
        className,
        'relative grid place-items-center overflow-hidden rounded-[32px]',
        'bg-customisation-50/10'
      )}
    >
      {children}
      <Image
        id="Textures/screen-texture:1663:2557"
        alt=""
        aria-hidden
        className="absolute inset-0 z-[-1]"
      />
    </div>
  )
}
