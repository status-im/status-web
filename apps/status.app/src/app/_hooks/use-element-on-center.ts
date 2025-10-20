import { useEffect, useRef } from 'react'

export const useElementOnCenter = () => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Get window width
    const windowWidth = window.innerWidth
    // Get the width of the element
    const elementWidth = ref.current!.scrollWidth

    // Set the scroll position centered
    ref.current!.scrollLeft = elementWidth / 2 - windowWidth / 2
  }, [])

  return { ref }
}
