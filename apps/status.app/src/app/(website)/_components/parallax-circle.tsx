import { customisation } from '@status-im/colors'
import { cx } from 'class-variance-authority'

import type { CustomisationColorType } from '@status-im/components'

type Props = {
  color?: CustomisationColorType
  zIndex?: number
  className?: string
}

const ParallaxCircle = (props: Props) => {
  const { color, className } = props

  return (
    <div
      // override CSS variable if color is provided
      {...(color && {
        style: {
          '--circle-background': customisation[color][50],
        } as React.CSSProperties,
      })}
      className={cx(
        'pointer-events-none absolute z-0 size-[676px] rounded-full',
        'scale-[1.75]',
        `bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[--circle-background] to-transparent to-70% opacity-[12%]`,
        className
      )}
    />
  )
}

export { ParallaxCircle }
