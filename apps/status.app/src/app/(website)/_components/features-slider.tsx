'use client'

import { useEffect, useRef, useState } from 'react'

import { cx } from 'class-variance-authority'
import { useSwipeable } from 'react-swipeable'

import { ScreenImage, ScreenVideo } from '~components/assets'

import { ColorTheme } from './color-theme'
import { ScreenBackground } from './screen-background'

import type { CustomisationColorType } from '@status-im/components'
import type { ImageId, ImageType, VideoId } from '~components/assets'

type Props = {
  items: Array<{
    title: string
    description: string
    image: ImageType
    video?: {
      id: VideoId
      posterId: ImageId
    }
    theme: CustomisationColorType
  }>
}

const TIME_INTERVAL = 16200
const TIME_INTERVAL_STEP = 50

const FeaturesSlider = (props: Props) => {
  const { items } = props

  const [width, setWidth] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const itemsRefs = useRef<Array<HTMLDivElement>>([])
  const videoRefs = useRef<Array<HTMLVideoElement>>([])

  // Swipeable handlers
  const onSwipedRight = () => {
    if (selectedIndex === 0) {
      return setSelectedIndex(selectedIndex)
    }
    setCounter(0)
    return setSelectedIndex(selectedIndex - 1)
  }

  const onSwipedLeft = () => {
    if (selectedIndex === items.length - 1) {
      return setSelectedIndex(selectedIndex)
    }
    setCounter(0)
    return setSelectedIndex(selectedIndex + 1)
  }

  const handlers = useSwipeable({
    onSwipedRight,
    onSwipedLeft,
    swipeDuration: 500,
    preventScrollOnSwipe: false,
    trackMouse: true,
  })

  // Check if the user has entered this component and check the scroll position for the element to make the sticky bottom component appear only after 96px of scroll
  useEffect(() => {
    const refElement = ref.current
    const itemsRefCurrent = itemsRefs.current
    const videoRefCurrent = videoRefs.current

    const item = itemsRefCurrent[selectedIndex]
    const video = videoRefCurrent[selectedIndex]

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true)
          // Scroll to the element just on the X axis
          refElement?.scrollTo({
            left: item.offsetLeft - (window.innerWidth - item.offsetWidth) / 2,
            behavior: 'smooth',
          })
          // Play the video as soon as the user enters the component
          if (video) {
            video.play()
          }
        } else {
          // Pause the video as soon as the user leaves the component
          if (video) {
            video.pause()
          }
          setHasEntered(false)
        }
      },
      { threshold: 0.5 }
    )
    if (refElement) {
      observer.observe(refElement)
    }
    return () => {
      if (refElement) {
        observer.unobserve(refElement)
      }
    }
  }, [items, selectedIndex])

  const [counter, setCounter] = useState(0)

  // Make the slider change the selected item with a time interval
  useEffect(() => {
    if (!hasEntered) return

    const interval = setInterval(() => {
      if (counter >= TIME_INTERVAL) {
        setSelectedIndex(prevIndex => (prevIndex + 1) % items.length)

        setCounter(0)
        setWidth(0)
      } else {
        setCounter(prevCounter => prevCounter + TIME_INTERVAL_STEP)
        // Calculate the width base on the counter.
        const newWidth = (counter * 100) / TIME_INTERVAL
        setWidth(newWidth)
      }
    }, TIME_INTERVAL_STEP)

    return () => {
      clearInterval(interval)
    }
  }, [items, hasEntered, selectedIndex, counter])

  // Reload the video when the value changes
  useEffect(() => {
    const videoRefCurrent = videoRefs.current
    const item = videoRefCurrent[selectedIndex]

    if (item) {
      item.currentTime = 0
      item.play()
    }
  }, [items, selectedIndex])

  return (
    <div className="relative" {...handlers}>
      <div
        ref={ref}
        className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto px-5 pt-24 scrollbar-none"
      >
        {items.map((item, index) => {
          return (
            <ColorTheme
              ref={element => {
                itemsRefs.current.push(element!)
              }}
              key={index}
              theme={item.theme}
              className="flex min-w-[calc(100vw-20px-16px-16px)] flex-col rounded-[32px] border border-neutral-80/10 bg-white-100 px-4 py-6"
            >
              <div className="pb-5 lg:pb-8">
                <p
                  className={cx(
                    'pb-6 text-left text-27 font-semibold xl:text-40 xl:font-bold'
                  )}
                >
                  {item.title}
                </p>
                <p className="text-19">{item.description}</p>
              </div>
              <ScreenBackground className="w-full flex-1 grow-[2] p-6 xl:max-w-[348px] xl:py-6 2xl:max-w-[572px] 2xl:py-12">
                {item.video ? (
                  <ScreenVideo
                    ref={element => {
                      videoRefs.current.push(element!)
                    }}
                    posterId={item.video.posterId}
                    id={item.video.id}
                    className="w-full max-w-[334px]"
                  />
                ) : (
                  <ScreenImage
                    alt={item.image.alt}
                    id={item.image.id}
                    className="w-full max-w-[334px]"
                  />
                )}
              </ScreenBackground>
            </ColorTheme>
          )
        })}
      </div>
      <div
        className="sticky inset-0 bottom-4 mx-auto mt-6 flex max-w-fit items-center justify-center gap-2 rounded-full bg-blur-white/70 px-5 py-4 backdrop-blur-[20px] transition-opacity"
        style={{
          opacity: hasEntered ? 1 : 0,
        }}
      >
        {/* Create a array with the same number of items to have dots */}
        {items.map((_, index) => {
          const isSelected = selectedIndex === index

          return (
            <div
              key={index}
              className="relative flex items-center justify-center overflow-hidden rounded-full"
            >
              {isSelected && (
                <div
                  style={{
                    transform: 'translateX(-4px)',
                    minWidth: `calc(${width}% + 4px)`,
                  }}
                  className={cx(
                    'absolute left-0 top-0 z-[2]',
                    'h-2 max-w-[52px] rounded-full',
                    'bg-neutral-100'
                  )}
                />
              )}
              <button
                onClick={() => {
                  if (isSelected) return
                  setCounter(0)
                  setSelectedIndex(index)
                }}
                style={{
                  width: isSelected ? '52px' : '8px',
                }}
                className={cx(
                  'h-2 rounded-full transition-all',
                  'bg-neutral-80/20'
                )}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { FeaturesSlider }
