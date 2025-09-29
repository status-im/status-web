/**
 * From https://github.com/remix-run/react-router/blob/main/packages/router/utils.ts#L1035-L1049
 */

export function resolvePathname(
  relativePath: string,
  fromPathname: string
): string {
  const segments = fromPathname.replace(/\/+$/, '').split('/')
  const relativeSegments = relativePath.split('/')

  relativeSegments.forEach(segment => {
    if (segment === '..') {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop()
    } else if (segment !== '.') {
      segments.push(segment)
    }
  })

  return segments.length > 1 ? segments.join('/') : '/'
}
