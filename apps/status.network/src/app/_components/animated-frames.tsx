'use client'

import { cx } from 'cva'
import Image from 'next/image'
import { ComponentProps, useEffect, useRef, useState } from 'react'

type Props = Omit<ComponentProps<typeof Image>, 'src'> & {
  images: string[]
  interval?: number
  delay?: number
  height: number
  width: number
}

const AnimatedFrames = ({
  images,
  interval = 1000,
  delay = 0,
  className,
  ...rest
}: Props) => {
  const [frameIndex, setFrameIndex] = useState(0)
  const frameRef = useRef<number | null>(null)
  const lastFrameTime = useRef(performance.now())
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setAnimationStarted(true)
      lastFrameTime.current = performance.now()
    }, delay)

    return () => {
      clearTimeout(delayTimeout)
    }
  }, [delay])

  useEffect(() => {
    if (!animationStarted) return

    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastFrameTime.current

      if (elapsed >= interval) {
        setFrameIndex(prev => (prev + 1) % images.length)
        lastFrameTime.current = timestamp
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [animationStarted, images.length, interval])

  return (
    <div className={className}>
      {images.map((src, index) => (
        <Image
          {...rest}
          key={src + index}
          src={src}
          alt={rest.alt || ''}
          priority
          className={cx([
            {
              hidden: index !== frameIndex,
            },
          ])}
        />
      ))}
    </div>
  )
}

export { AnimatedFrames }
