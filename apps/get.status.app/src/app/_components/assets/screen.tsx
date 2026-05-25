import { forwardRef } from 'react'

import { cva } from 'class-variance-authority'

import { Image } from './image'
import { Video } from './video'

import type { ImageProps } from './image'
import type { ImageId } from './types'
import type { VideoProps } from './video'
import type { ForwardedRef } from 'react'

const styles = cva(
  [
    'rounded-20 border-4 border-[var(--screen-border,#EAEEF1)] bg-[var(--screen-border,#EAEEF1)] md:rounded-[24px]',
    'overflow-hidden',
  ],

  {
    variants: {
      align: {
        top: '!rounded-t-0 border-t-0',
        bottom: '!rounded-b-0 border-b-0',
      },
    },
  }
)

export const ScreenImage = <K extends ImageId>(
  props: ImageProps<K> & { align?: 'top' | 'bottom' }
) => {
  return (
    <Image
      {...props}
      className={styles({
        align: props.align,
        className: props.className,
      })}
    />
  )
}

export const ScreenVideo = forwardRef(
  (props: VideoProps, ref: ForwardedRef<HTMLVideoElement>) => {
    const { className, ...rest } = props
    return (
      <div
        className={styles({
          className,
        })}
      >
        <Video {...rest} ref={ref} className="scale-[1.02]" />
      </div>
    )
  }
)

ScreenVideo.displayName = 'ScreenVideo'
