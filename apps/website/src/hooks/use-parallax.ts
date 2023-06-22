import { useEffect, useState } from 'react'

type ParalaxProps = {
  initialLeft?: number
  initialTop?: number
  initialRight?: number
  initialBottom?: number
}

const PARALLAX_SPEED = 4

function useParalax(props?: ParalaxProps) {
  const initialTop = props?.initialTop || 0
  const initialBottom = props?.initialBottom || 0

  const [top, setTop] = useState(initialTop)

  const [bottom, setBottom] = useState(initialBottom)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      setTop(scrollY / PARALLAX_SPEED + initialTop)
      setBottom(scrollY / PARALLAX_SPEED + initialBottom)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [initialBottom, initialTop])

  return { top, bottom }
}

export { useParalax }
