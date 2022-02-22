import { useEffect, useState } from 'react'

export function useRefBreak(dimension: number, sizeThreshold: number) {
  const [widthBreak, setWidthBreak] = useState(dimension < sizeThreshold)

  useEffect(() => {
    const checkDimensions = () => {
      if (dimension && dimension < sizeThreshold && dimension > 0) {
        if (widthBreak === false) {
          setWidthBreak(true)
        }
      } else {
        if (widthBreak === true) {
          setWidthBreak(false)
        }
      }
    }
    checkDimensions()
    window.addEventListener('resize', checkDimensions)
    return () => {
      window.removeEventListener('resize', checkDimensions)
    }
  }, [dimension, widthBreak, sizeThreshold])

  return widthBreak
}
