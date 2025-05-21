'use client'

import { useEffect, useRef, useState } from 'react'

import { cva, cx } from 'class-variance-authority'

const backgroundStyles = cva(
  'pointer-events-none sticky top-0 z-30 flex flex-col justify-start gap-1 overflow-hidden border-b px-12 py-4 transition-all duration-200 ease-in-out',
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

const secondaryLeftSlotStyles = cva('transition-all duration-100 ease-in-out', {
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

  const containerRef = useRef<HTMLDivElement>(null)

  const [collapsed, setCollapsed] = useState(false)
  const [showRightSlot, setShowRightSlot] = useState(false)
  const [showSecondaryLeftSlot, setShowSecondaryLeftSlot] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop

      const threshold = SMALL_THRESHOLD
      const rightThreshold = hasSecondaryLeftSlot ? LARGE_THRESHOLD : threshold

      setCollapsed(scrollTop > threshold)
      setShowRightSlot(scrollTop > rightThreshold)
      setShowSecondaryLeftSlot(
        hasSecondaryLeftSlot && scrollTop >= LARGE_THRESHOLD,
      )
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [hasSecondaryLeftSlot])

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-56px)] overflow-auto scrollbar-stable"
    >
      <div
        className={cx(
          backgroundStyles({
            collapsed,
            size: showSecondaryLeftSlot ? 'large' : 'default',
          }),
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className={leftSlotStyles({ collapsed })}>{leftSlot}</div>
          <div className={rightSlotStyles({ showRightSlot })}>{rightSlot}</div>
        </div>
        <div className={secondaryLeftSlotStyles({ showSecondaryLeftSlot })}>
          {secondaryLeftSlot}
        </div>
      </div>
      {children}
    </div>
  )
}

export { StickyHeaderContainer }
