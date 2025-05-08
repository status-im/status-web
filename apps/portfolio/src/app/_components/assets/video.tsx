'use client'

import { forwardRef } from 'react'

import Head from 'next/head'

import { createCloudinaryUrl } from './loader'

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
    const movSrc = `https://res.cloudinary.com/dhgck7ebz/video/upload/v1/${publicId}_HEVC.mov`
    const webmSrc = `https://res.cloudinary.com/dhgck7ebz/video/upload/f_auto:video,q_auto/v1/${publicId}`

    return (
      <>
        {priority && (
          <Head>
            <link
              rel="preload"
              href={posterSrc}
              as="image"
              // note: https://github.com/facebook/react/issues/27233#issuecomment-2035176576
              fetchPriority="high"
            />
            <link
              rel="preload"
              href={webmSrc}
              as="video"
              // note: https://github.com/facebook/react/issues/27233#issuecomment-2035176576
              fetchPriority="high"
            />
          </Head>
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
