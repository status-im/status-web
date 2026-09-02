'use client'

import { forwardRef } from 'react'

import {
  createCloudinaryUrl,
  createCloudinaryVideoMovUrl,
  createCloudinaryVideoUrl,
} from './loader'

import type { ImageId, VideoId } from './types'
import type { ForwardedRef } from 'react'

type Props = React.ComponentProps<'video'> & {
  id: VideoId
  posterId: ImageId
  priority?: boolean
  isTransparent?: boolean
}

const Video = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLVideoElement>) => {
    const {
      id,
      posterId,
      priority = false,
      isTransparent = false,
      ...videoProps
    } = props

    const [publicId, width, height] = id.split(':')
    const aspectRatio = Math.round((Number(width) / Number(height)) * 100) / 100

    const posterSrc = createCloudinaryUrl(posterId)
    const movSrc = createCloudinaryVideoMovUrl(publicId)
    const webmSrc = createCloudinaryVideoUrl(publicId)

    return (
      <>
        {/*
          `next/head` is a Pages Router API and renders nothing in the App
          Router, so this preload never reached the document and `priority` had
          no effect. React 19 hoists a bare `<link rel="preload">` into <head>.

          Poster only: the video file behind it runs to several megabytes, and
          preloading that at high priority would starve the real LCP element
          rather than help it. The poster is what paints first.
        */}
        {priority && (
          <link
            rel="preload"
            href={posterSrc}
            as="image"
            fetchPriority="high"
          />
        )}

        <video
          ref={ref}
          {...videoProps}
          autoPlay
          loop
          playsInline
          muted
          width={width}
          height={height}
          poster={posterSrc}
          style={{
            aspectRatio,
            clipPath: 'inset(2px 2px)',
          }}
        >
          {isTransparent && !publicId.includes('_HEVC') && (
            <source src={movSrc} type="video/mp4;codecs=hvc1" />
          )}
          <source src={webmSrc} type="video/mp4" />
          <source src={webmSrc} type="video/webm" />
        </video>
      </>
    )
  }
)

Video.displayName = 'Video'

export { Video }
export type { Props as VideoProps }
