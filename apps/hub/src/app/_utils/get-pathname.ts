import { headers } from 'next/headers'

export async function getPathname(): Promise<string> {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const segments = pathname.split('/').filter(Boolean)

  let basePagePath = '/'

  if (segments[0] === 'en' || segments[0] === 'ko') {
    basePagePath = '/' + segments.slice(1).join('/')
  } else {
    basePagePath = pathname
  }

  return basePagePath
}
