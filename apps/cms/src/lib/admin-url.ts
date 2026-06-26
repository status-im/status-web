export const stripAdminNotFoundParam = (url: URL): URL | null => {
  if (!url.pathname.startsWith('/admin')) return null
  if (!url.searchParams.has('notFound')) return null

  const nextUrl = new URL(url)
  nextUrl.searchParams.delete('notFound')
  return nextUrl
}
