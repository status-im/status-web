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

      setPosition((prevPosition: string) => {
        if (scrollTop === 0) return 'top'
        if (scrollTop + clientHeight === scrollHeight) return 'bottom'
        if (prevPosition !== 'middle') return 'middle'
        return prevPosition
      })
    }

    node?.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      node?.removeEventListener('scroll', handleScroll)
    }
  }, [ref])

  return position
}
