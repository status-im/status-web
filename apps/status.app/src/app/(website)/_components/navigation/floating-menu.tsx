'use client'

import { useEffect, useRef, useState } from 'react'

import { animated, useScroll } from '@react-spring/web'
import { cx } from 'class-variance-authority'
import { usePathname } from 'next/navigation'

import { useOutsideClick } from '~hooks/use-outside-click'

import { FloatingDesktop } from './floating-desktop'
import { FloatingMobile } from './floating-mobile'

const DETECTION_POINT = 56
const SCROLL_UP_THRESHOLD = 40

const FloatingMenu = () => {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  const openRef = useRef(open)
  openRef.current = open

  // Using ref to prevent re-running of useEffect
  const visibleRef = useRef(visible)
  const scrollYRef = useRef(0)
  const lastScrollPositionOnScrollUpRef = useRef(0)
  visibleRef.current = visible
  const isScrollingUpRef = useRef(false)

  // Close menu on outside click
  const ref = useOutsideClick(() => setOpen(false))

  useScroll({
    onChange: ({ value: { scrollY } }) => {
      const isMenuOpen = openRef.current
      const isScrollingUp = scrollY < scrollYRef.current
      const detectionPoint = scrollY > DETECTION_POINT

      if (!isScrollingUpRef.current && isScrollingUp) {
        lastScrollPositionOnScrollUpRef.current = scrollY
        isScrollingUpRef.current = true
      } else if (isScrollingUpRef.current && !isScrollingUp) {
        isScrollingUpRef.current = false
      }

      const difference = Math.abs(
        lastScrollPositionOnScrollUpRef.current - scrollY
      )

      if (detectionPoint && isScrollingUp && difference > SCROLL_UP_THRESHOLD) {
        if (!visibleRef.current) {
          setVisible(true)
        }
      } else {
        if (!isMenuOpen) {
          setVisible(false)
        }
      }
      scrollYRef.current = scrollY
    },
    default: {
      immediate: true,
    },
  })

  const pathname = usePathname()!
  useEffect(() => {
    setOpen(false)
    setVisible(false)
  }, [pathname])

  const styles: React.CSSProperties = {
    pointerEvents: visible ? 'auto' : 'none',
    opacity: visible ? 1 : 0,
    // Solves the issue of the green line on Firefox with certain videos
    backfaceVisibility: 'hidden',
  }

  return (
    <>
      <animated.div
        ref={ref}
        style={styles}
        className={cx([
          'fixed left-1/2 top-1 z-10 flex -translate-x-1/2 flex-col items-center justify-between p-2 pb-0 [@media(min-width:1100px)]:hidden',
          'rounded-16 border border-neutral-80/5 bg-blur-neutral-80/80 backdrop-blur-md',
          'w-[calc(100%-24px)]',
          'opacity-[0%] transition-opacity data-[visible=true]:opacity-[100%]',
          'z-50',
        ])}
      >
        <FloatingMobile open={open} setOpen={setOpen} />
      </animated.div>
      <animated.div
        style={styles}
        className={cx([
          'fixed left-1/2 top-5 z-20 w-max min-w-[746px] -translate-x-1/2 overflow-hidden',
          'rounded-16 border border-neutral-80/5 bg-blur-neutral-80/80 backdrop-blur-md',
          'z-50 hidden [@media(min-width:1100px)]:block',
        ])}
      >
        <FloatingDesktop visible={visible} />
      </animated.div>
    </>
  )
}

export { FloatingMenu }
