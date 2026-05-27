import { cx } from 'class-variance-authority'

import { Image } from './image'

import type { ImageProps } from './image'
import type { ImageId } from './types'

type Props<K extends ImageId> = Omit<
  ImageProps<K>,
  'width' | 'height' | 'alt'
> & {
  size?: number
}

const Icon = <K extends ImageId>(props: Props<K>) => {
  const { size, className, ...imageProps } = props

  return (
    <Image
      {...(imageProps as ImageProps<K>)}
      width={size ?? 48}
      height={size ?? 48}
      className={cx(className, 'aspect-square')}
    />
  )
}

export { Icon }
export type { Props as IconProps }
