import { Tag } from '@status-im/components'
import { cx } from 'class-variance-authority'

import { Image, Video } from '~components/assets'

import type { ImageAlt, ImageId, VideoId } from '~components/assets'

type Props = {
  tag: string | React.ReactElement
  title: React.ReactNode
  description?: React.ReactNode
  video?: { id: VideoId; posterId: ImageId }
  image?: {
    id: ImageId
    width: number
    height: number
    priority?: boolean
    alt: ImageAlt[ImageId]
  }
  action?: React.ReactNode
  reverse?: boolean
  className?: string
  innerClassName?: string
  circle?: React.ReactNode
  imageClassName?: string
  videoClassName?: string
}

export const HeroSection = (props: Props) => {
  const {
    video,
    image,
    className,
    tag,
    title,
    description,
    action,
    circle,
    reverse = false,
    innerClassName,
    imageClassName,
    videoClassName,
  } = props

  return (
    <div
      className={cx(
        'container relative flex flex-col items-stretch pt-16 xl:pb-20 xl:pt-40',
        reverse ? 'xl:flex-row-reverse' : 'xl:flex-row',
        className
      )}
    >
      {circle}
      <div
        className={cx([
          'relative z-10 max-w-[582px] shrink-0 pb-12 xl:pb-0',
          innerClassName,
        ])}
      >
        <div className="mb-4 flex gap-2">
          {typeof tag === 'string' ? <Tag size="32" label={tag} /> : tag}
        </div>
        <div className="grid place-items-start gap-6">
          <h1 className="text-48 font-bold xl:text-88">{title}</h1>
          {description && (
            <h2 className="text-27 font-regular xl:pr-16">{description}</h2>
          )}
          {action}
        </div>
      </div>

      {video && (
        <div
          className={cx(
            'relative z-0 flex-1 2xl:-mt-16',
            reverse ? '2xl:-ml-30' : '2xl:-mr-30',
            videoClassName
          )}
        >
          <Video {...video} priority />
        </div>
      )}
      {image && (
        <div
          className={cx(
            'relative z-0 flex-1 2xl:-mt-16',
            reverse ? '2xl:-ml-30' : '2xl:-mr-30',
            imageClassName
          )}
        >
          <Image {...image} />
        </div>
      )}
    </div>
  )
}
