import { useEffect, useState } from 'react'

import { useThrottle } from './use-throttle'

interface UseBlurReturn {
  shouldBlurBottom: boolean
  shouldBlurTop: boolean
}

type UseBlurProps = {
  ref: React.RefObject<HTMLDivElement>
  marginBlurBottom?: number
  heightTop?: number
  throttle?: number
}

const useBlur = (props: UseBlurProps): UseBlurReturn => {
  const {
    marginBlurBottom = 32,
    heightTop = 96,
    throttle = 100,
    ref,
  } = props || {}

  const [shouldBlurTop, setShouldBlurTop] = useState(false)
  const [shouldBlurBottom, setShouldBlurBottom] = useState(false)

  const handleScroll = useThrottle(() => {
    const scrollPosition = ref.current!.scrollTop
    const elementHeight = ref.current!.clientHeight
    const scrollHeight = ref.current?.scrollHeight || 0

    if (scrollPosition >= heightTop) {
      setShouldBlurTop(true)
    }

    if (scrollPosition < heightTop) {
      setShouldBlurTop(false)
    }

    if (scrollPosition < scrollHeight - (elementHeight + marginBlurBottom)) {
      setShouldBlurBottom(true)
    }

    if (scrollPosition >= scrollHeight - (elementHeight + marginBlurBottom)) {
      setShouldBlurBottom(false)
    }
  }, throttle)

  useEffect(() => {
    const element = props.ref
    if (!element.current) {
      throw new Error('useBlur ref not set correctly')
    }

    element.current!.addEventListener('scroll', handleScroll, { passive: true })

    handleScroll()

    return () => {
      element.current!.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, props.ref])

  return { shouldBlurBottom, shouldBlurTop }
}

export { useBlur }
