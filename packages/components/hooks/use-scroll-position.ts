import { useRef, useState } from 'react'

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

interface ScrollPosition {
  ref: React.RefObject<HTMLDivElement>
  scrollPos: number
}

const useScrollPosition = (): ScrollPosition => {
  const ref = useRef<HTMLDivElement>(null)
  const [scrollPos, setScrollPos] = useState(0)

  useIsomorphicLayoutEffect(() => {
    const newRef = ref.current
    const handleScroll = () => {
      setScrollPos(newRef!.scrollTop)
    }
    newRef!.addEventListener('scroll', handleScroll)

    return () => {
      newRef!.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return { ref, scrollPos }
}

export { useScrollPosition }
