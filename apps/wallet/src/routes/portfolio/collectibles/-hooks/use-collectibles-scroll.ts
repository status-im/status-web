import { useLayoutEffect } from 'react'

let savedScrollTop = 0

const getScrollContainer = (element?: HTMLElement | null) =>
  element?.closest('.scrollbar-stable')

export const useCollectiblesScrollSaver = () => {
  const saveScrollFromElement = (element?: HTMLElement | null) => {
    const container = getScrollContainer(element)
    if (container) {
      savedScrollTop = container.scrollTop
    }
  }

  return { saveScrollFromElement }
}

export const useCollectiblesScrollRestorer = () => {
  useLayoutEffect(() => {
    if (savedScrollTop <= 0) return

    const container = document.querySelector('.scrollbar-stable')
    if (container instanceof HTMLElement) {
      container.scrollTop = savedScrollTop
    }
  }, [])
}
