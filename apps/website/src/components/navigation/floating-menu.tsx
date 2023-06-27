import { useRef, useState } from 'react'

import { animated, useScroll } from '@react-spring/web'
import { cx } from 'class-variance-authority'

import { useLockScroll } from '@/hooks/use-lock-scroll'
import { useOutsideClick } from '@/hooks/use-outside-click'

import { FloatingDesktop } from './floating-desktop'
import { FloatingMobile } from './floating-mobile'

const FloatingMenu = (): JSX.Element => {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const openRef = useRef(open)
  openRef.current = open

  // Using ref to prevent re-running of useEffect
  const visibleRef = useRef(visible)
  const scrollYRef = useRef(0)
  visibleRef.current = visible

  // Close menu on outside click
  const ref = useOutsideClick(() => setOpen(false))
  useLockScroll(open)

  useScroll({
    onChange: ({ value: { scrollYProgress } }) => {
      const isMenuOpen = openRef.current
      const isScrollingUp = scrollYProgress < scrollYRef.current
      const detectionPoint = scrollYProgress > 0.005

      if (detectionPoint && isScrollingUp) {
        if (!visibleRef.current) {
          setVisible(true)
        }
      } else {
        if (!isMenuOpen) {
          setVisible(false)
        }
      }
      scrollYRef.current = scrollYProgress
    },
    default: {
      immediate: true,
    },
  })

  return (
    <>
      <animated.div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
        }}
        className={cx([
          'fixed left-1/2 top-1 z-10 flex -translate-x-1/2 flex-col items-center justify-between p-2 pb-0 lg:hidden',
          'rounded-2xl border border-neutral-80/5 bg-blur-neutral-80/80 backdrop-blur-md',
          ' w-[calc(100%-24px)]',
          ' opacity-0 transition-opacity data-[visible=true]:opacity-100',
          'z-10',
        ])}
      >
        <FloatingMobile open={open} setOpen={setOpen} />
      </animated.div>
      <animated.div
        style={{
          opacity: visible ? 1 : 0,
        }}
        className={cx([
          'fixed left-1/2 top-5 z-10 w-max min-w-[746px] -translate-x-1/2 overflow-hidden',
          'rounded-2xl border border-neutral-80/5 bg-blur-neutral-80/80 backdrop-blur-md',
          'hidden md-lg:block',
        ])}
      >
        <FloatingDesktop visible={visible} />
      </animated.div>
    </>
  )
}

export { FloatingMenu }
