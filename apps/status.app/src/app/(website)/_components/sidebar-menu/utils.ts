export function decodeUriComponent(str: string): string {
  return decodeURIComponent(str.replace(/\+/g, '%20'))
}

export const appendDateQueryParams = (url: string) => {
  // Check if window is defined (for SSR)
  if (typeof window === 'undefined') {
    return url
  }

  const currentQueryParams = new URLSearchParams(window.location.search)
  const urlWithParams = new URL(
    url,
    window.location.origin + window.location.pathname
  )

  // Preserve only startDate and endDate params from the current URL
  const startDate = currentQueryParams.get('startDate')
  const endDate = currentQueryParams.get('endDate')

  if (startDate) {
    urlWithParams.searchParams.set('startDate', startDate)
  }

  if (endDate) {
    urlWithParams.searchParams.set('endDate', endDate)
  }

  return urlWithParams.pathname + urlWithParams.search + urlWithParams.hash
}
