import { useLayoutEffect } from 'react'

export const SCROLL_CONTAINER_SELECTOR = '.scrollbar-stable'

let savedScrollTop = 0

const getScrollContainer = (
  element?: HTMLElement | null,
  selector: string = SCROLL_CONTAINER_SELECTOR,
) => element?.closest(selector)

export const useScrollSaver = (
  selector: string = SCROLL_CONTAINER_SELECTOR,
) => {
  const saveScrollFromElement = (element?: HTMLElement | null) => {
    const container = getScrollContainer(element, selector)
    if (container) {
      savedScrollTop = container.scrollTop
    }
  }

  return { saveScrollFromElement }
}

export const useScrollRestorer = (
  selector: string = SCROLL_CONTAINER_SELECTOR,
) => {
  useLayoutEffect(() => {
    if (savedScrollTop <= 0) return

    const container = document.querySelector(selector)
    if (container instanceof HTMLElement) {
      container.scrollTop = savedScrollTop
    }
  }, [selector])
}
