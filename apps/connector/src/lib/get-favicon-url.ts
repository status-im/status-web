export function getFaviconUrl() {
  const faviconElement =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (faviconElement) {
    return faviconElement.href
  }

  const iconElements =
    document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]')

  if (iconElements.length === 0) {
    return null
  }

  return iconElements[0].href
}
