export const useLockScroll = (open = false) => {
  if (typeof document === 'undefined') {
    return
  }
  // Adds the following code to disable scrolling when the menu is open
  const rootElement = document.documentElement
  if (open) {
    rootElement.style.overflowY = 'hidden'
  } else {
    rootElement.style.overflowY = 'auto'
  }
}
