import { useEffect, useRef, useState } from 'react'

type Position = 'top' | 'middle' | 'bottom'

type Options = {
  ref: React.RefObject<HTMLElement>
}

export function useScrollPosition(options: Options) {
  const { ref } = options

  const [position, setPosition] = useState<Position>('bottom')
  const positionRef = useRef(position)

  // Using ref for storing position because don't want to recreate the event listener
  positionRef.current = position

  useEffect(() => {
    const node = ref.current

    const handleScroll = () => {
      if (!node) return

      const { scrollTop, scrollHeight, clientHeight } = node

      if (scrollTop === 0) {
        setPosition('top')
        return
      }

      if (scrollTop + clientHeight === scrollHeight) {
        setPosition('bottom')
        return
      }

      if (positionRef.current !== 'middle') {
        setPosition('middle')
      }
    }

    node.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      node.removeEventListener('scroll', handleScroll)
    }
  }, [ref])

  return position
}
