import React, { useEffect, useMemo, useRef, useState } from 'react'

const TIMEOUT = 600

type Props = {
  initialVisible?: boolean
  defaultHeight?: number
  visibleOffset?: number
  disabled?: boolean
  root?: HTMLElement | null
  rootElement?: string
  rootElementClass?: string
  children: React.ReactNode
  placeholderComponent?: React.ReactNode
}

export const RenderIfVisible = ({
  initialVisible = false,
  defaultHeight = 300,
  visibleOffset = 1000,
  disabled = false,
  root = null,
  rootElement = 'div',
  rootElementClass = '',
  placeholderComponent: PlaceholderComponent,
  children,
}: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(initialVisible)
  const wasVisible = useRef<boolean>(initialVisible)
  const placeholderHeight = useRef<number>(defaultHeight)
  const intersectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (intersectionRef.current) {
      const localRef = intersectionRef.current
      const observer = new IntersectionObserver(
        entries => {
          if (!entries[0].isIntersecting) {
            placeholderHeight.current = localRef!.offsetHeight
          }
          if (typeof window !== undefined && window.requestIdleCallback) {
            window.requestIdleCallback(
              () => setIsVisible(entries[0].isIntersecting),
              {
                timeout: TIMEOUT,
              }
            )
          } else {
            setIsVisible(entries[0].isIntersecting)
          }
        },
        { root, rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px` }
      )

      observer.observe(localRef)
      return () => {
        if (localRef) {
          observer.unobserve(localRef)
        }
      }
    }
  }, [root, visibleOffset])

  useEffect(() => {
    if (isVisible) {
      wasVisible.current = true
    }
  }, [isVisible])

  const rootClasses = useMemo(
    () => `renderIfVisible ${rootElementClass}`,
    [rootElementClass]
  )

  return React.createElement(
    rootElement,
    {
      ref: intersectionRef,
      className: rootClasses,
    },
    isVisible || (disabled && wasVisible.current)
      ? children
      : PlaceholderComponent || null
  )
}
