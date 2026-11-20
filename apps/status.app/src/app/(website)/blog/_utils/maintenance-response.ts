import { blog } from '../../../../../messages/en.json'

const body = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${blog.maintenanceTitle}</title>
<style>
body{margin:0;font:1rem system-ui,sans-serif;color:#09101c;background:#fff}
main{padding:4rem 1.5rem;text-align:center}
h1{font-size:1.5rem}
p{color:#647084}
a{color:#255dd6}
</style>
<main>
<h1>${blog.maintenanceTitle}</h1>
<p>${blog.maintenanceDescription}</p>
<a href="">${blog.retryArticle}</a>
</main>
</html>`

export function blogMaintenanceResponse() {
  return new Response(body, {
    status: 503,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '300',
    },
  })
}
