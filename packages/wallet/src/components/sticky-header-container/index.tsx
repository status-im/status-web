'use client'

import { useEffect, useRef, useState } from 'react'

import { cva, cx } from 'class-variance-authority'

const backgroundStyles = cva(
  'sticky top-0 z-30 flex flex-col justify-start gap-1 overflow-hidden border-b px-12 py-4 transition-all duration-200 ease-in-out',
  {
    variants: {
      collapsed: {
        false: 'max-h-[48px] min-h-[48px] border-transparent bg-transparent',
        true: 'max-h-[64px] min-h-[64px] border-neutral-20 bg-blur-white/70 backdrop-blur-[20px]',
      },
      size: {
        default: '',
        large: '',
      },
    },
    compoundVariants: [
      {
        collapsed: true,
        size: 'large',
        className: '!min-h-[100px]',
      },
    ],
  },
)

const leftSlotStyles = cva('transition-opacity duration-100 ease-in-out', {
  variants: {
    collapsed: {
      false: 'opacity-[0]',
      true: 'opacity-[1]',
    },
  },
})

const secondaryleftSlotStyles = cva('transition-all duration-100 ease-in-out', {
  variants: {
    showSecondaryLeftSlot: {
      false: 'pointer-events-none max-h-0 translate-y-full opacity-[0]',
      true: 'pointer-events-auto max-h-[48px] translate-y-0 opacity-[1]',
    },
  },
})

const rightSlotStyles = cva('transition-all', {
  variants: {
    showRightSlot: {
      false: 'pointer-events-none translate-y-full opacity-[0]',
      true: 'pointer-events-auto translate-y-0 opacity-[1]',
    },
  },
})

type Props = {
  leftSlot: React.ReactNode
  secondaryLeftSlot?: React.ReactNode
  rightSlot: React.ReactNode
  children: React.ReactNode
  className?: string
}

const SMALL_THRESHOLD = 42
const LARGE_THRESHOLD = 132

const StickyHeaderContainer = (props: Props) => {
  const { leftSlot, rightSlot, secondaryLeftSlot, className, children } = props

  const hasSecondaryLeftSlot = Boolean(secondaryLeftSlot)

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [collapsed, setCollapsed] = useState(false)
  const [showRightSlot, setShowRightSlot] = useState(false)
  const [showSecondaryLeftSlot, setShowSecondaryLeftSlot] = useState(false)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const threshold = SMALL_THRESHOLD
    const rightSlotThreshold = !showSecondaryLeftSlot
      ? threshold
      : LARGE_THRESHOLD

    if (!scrollContainer) return

    const handleScroll = () => {
      const scrollPosition = Math.round(scrollContainer.scrollTop)

      setCollapsed(scrollPosition > threshold)
      setShowRightSlot(scrollPosition > rightSlotThreshold)

      setShowSecondaryLeftSlot(
        hasSecondaryLeftSlot && scrollPosition >= LARGE_THRESHOLD,
      )
    }

    scrollContainer.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [hasSecondaryLeftSlot, scrollContainerRef, showSecondaryLeftSlot])

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-1 flex-col overflow-auto scrollbar-stable"
    >
      <div
        className={cx([
          backgroundStyles({
            collapsed,
            size: showSecondaryLeftSlot ? 'large' : 'default',
          }),
          className,
        ])}
      >
        <div className="flex items-center justify-between">
          <div className={leftSlotStyles({ collapsed })}>{leftSlot}</div>
          <div className={rightSlotStyles({ showRightSlot })}>{rightSlot}</div>
        </div>
        <div className={secondaryleftSlotStyles({ showSecondaryLeftSlot })}>
          {secondaryLeftSlot}
        </div>
      </div>
      {children}
    </div>
  )
}

export { StickyHeaderContainer }
