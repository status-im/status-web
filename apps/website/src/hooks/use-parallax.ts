import { useEffect, useState } from 'react'

type ParalaxProps = {
  initialLeft?: number
  top?: number
  initialRight?: number
  bottom?: number
}

const PARALLAX_SPEED = 4

function useParalax(props?: ParalaxProps) {
  const top = props?.top ?? 0
  const bottom = props?.bottom ?? 0

  const [position, setPosition] = useState({
    top,
    bottom,
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      setPosition({
        top: scrollY / PARALLAX_SPEED + top,
        bottom: scrollY / PARALLAX_SPEED + bottom,
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [top, bottom])

  return position
}

export { useParalax }
