const body =
  '<!doctype html><html lang="en"><meta charset="utf-8">' +
  '<title>Blog post temporarily unavailable</title>' +
  '<h1>Blog post temporarily unavailable</h1>' +
  '<p><a href="/blog">Browse available posts</a></p></html>'

export function unavailableBlogPost() {
  return new Response(body, {
    status: 503,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '300',
    },
  })
}
