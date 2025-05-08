'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cx } from 'class-variance-authority'
import { useSwipeable } from 'react-swipeable'

import { Image } from '../image'

import type { ImageType } from '../image'

type Props = {
  items: Array<{
    title: string
    description: string
    image: ImageType
  }>
}

const TIME_INTERVAL = 16200

const Slider = (props: Props) => {
  const { items } = props

  const [selectedIndex, setSelectedIndex] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>(0)

  const itemsRefs = useRef<Array<HTMLDivElement | null>>([])
  const sliderRef = useRef<HTMLDivElement>(null)

  const calculateItemWidth = useCallback(() => {
    if (sliderRef.current) {
      return sliderRef.current.clientWidth / items.length
    }
    return 0
  }, [items.length])

  const updateSliderPosition = useCallback(() => {
    if (sliderRef.current) {
      const itemWidth = calculateItemWidth()
      sliderRef.current.style.transform = `translateX(-${
        selectedIndex * itemWidth
      }px)`
    }
  }, [selectedIndex, calculateItemWidth])

  const startAnimation = useCallback(() => {
    // We use performance.now() to get the current time. This is more accurate than Date.now() and is not affected by system time changes.
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsedTime = time - startTime
      const progress = Math.min(elapsedTime / TIME_INTERVAL, 1)
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `translateX(${
          (progress - 1) * 100
        }%)`
      }
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setSelectedIndex(prevIndex => (prevIndex + 1) % items.length)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [items.length])

  useEffect(() => {
    // Handles the animation of the progress bar
    const restartAnimation = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = 'translateX(-100%)'
        startAnimation()
      }
    }

    restartAnimation()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [startAnimation, selectedIndex])

  useEffect(() => {
    updateSliderPosition()

    // Debounced resize handler
    const handleResize = () => {
      updateSliderPosition()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateSliderPosition])

  // Swipeable handlers
  const onSwipedRight = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const onSwipedLeft = () => {
    if (selectedIndex < items.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handlers = useSwipeable({
    onSwipedRight,
    onSwipedLeft,
    swipeDuration: 500,
    preventScrollOnSwipe: false,
    trackMouse: true,
  })

  return (
    <div
      className="relative h-full overflow-hidden rounded-20 bg-neutral-100 px-[53px]"
      {...handlers}
    >
      <div
        className={cx(
          'pointer-events-none absolute left-[-397px] top-[-397px] size-[794px] rounded-full',
          'bg-customisation-purple-50',
          'opacity-[40%]',
          'blur-[114px]',
          'animate-float',
        )}
      />
      <div
        className={cx(
          'pointer-events-none absolute bottom-[-860px] left-[-308px] size-[924px] rounded-full',
          'bg-customisation-orange-50',
          'opacity-[30%]',
          'blur-[114px]',
          'animate-float-reverse',
        )}
      />
      <div
        className={cx(
          'pointer-events-none absolute right-[-508px] top-[-462px] size-[924px] rounded-full',
          'bg-customisation-sky-50',
          'opacity-[30%]',
          'blur-[114px]',
          'animate-float',
        )}
      />
      <div
        className={cx(
          'pointer-events-none absolute bottom-[-662px] right-[-608px] size-[924px] rounded-full',
          'bg-customisation-yellow-50',
          'opacity-[30%]',
          'blur-[114px]',
          'animate-float-reverse',
        )}
      />
      <div className="mask-image absolute top-0 z-10 bg-[url('/noise.png')]" />
      <Image
        id="Portfolio/Landing/Background/01:297:327"
        alt=""
        className="absolute left-[-120px] top-[-190px] z-0 w-[291px] blur-[10px]"
      />
      <Image
        id="Portfolio/Landing/Background/02:264:288"
        alt=""
        className="absolute bottom-0 right-[-180px] z-0 w-[242px] blur-[17px]"
      />

      {/* Images slider */}
      <div
        ref={sliderRef}
        className="relative z-20 flex size-full select-none snap-x snap-mandatory items-center gap-5 overflow-x-auto transition-transform duration-300 ease-in-out scrollbar-none"
        style={{
          width: `${items.length * 100}%`,
        }}
      >
        <div className="relative inline-flex h-fit w-full items-center justify-center">
          {items.map((item, index) => {
            const isSelected = selectedIndex === index
            return (
              <div
                ref={el => {
                  itemsRefs.current[index] = el
                }}
                key={index}
                className={cx([
                  'flex flex-col items-center justify-center px-[53px] transition-opacity duration-500',
                  isSelected ? 'opacity-[100%]' : 'opacity-[0%]',
                ])}
                style={{
                  width: `calc(100%/${items.length})`,
                }}
              >
                <Image
                  alt={item.image.alt}
                  id={item.image.id}
                  className="max-h-[400px] w-fit object-contain"
                  draggable={false}
                />

                <div className="max-w-[606px] text-center">
                  <p className={cx('pb-4 text-27 font-600 text-white-100')}>
                    {item.title}
                  </p>
                  <p className="text-19 text-white-80">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* Dots navigation */}
      <div className="absolute bottom-16 left-1/2 z-20 mx-auto flex max-w-fit -translate-x-1/2 items-center justify-center gap-2">
        {items.map((_, index) => {
          const isSelected = selectedIndex === index

          return (
            <div
              key={index}
              className="relative flex items-center justify-center overflow-hidden rounded-full"
            >
              {isSelected && (
                <div
                  ref={progressBarRef}
                  className={cx(
                    'absolute left-0 top-0 z-[2]',
                    'h-2 w-[52px] rounded-full',
                    'bg-white-100',
                  )}
                  style={{ transform: 'translateX(-100%)' }}
                />
              )}
              <button
                onClick={() => {
                  if (!isSelected) {
                    setSelectedIndex(index)
                  }
                }}
                style={{
                  width: isSelected ? '52px' : '8px',
                }}
                className={cx('h-2 rounded-full transition-all', 'bg-white-20')}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Slider }
export type { Props as SliderProps }
