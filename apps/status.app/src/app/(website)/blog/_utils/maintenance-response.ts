import { blogMaintenanceHeaders } from '~/config/blog-maintenance'

import messages from '../../../../../messages/en.json'

const { maintenanceTitle, maintenanceDescription, retryArticle } = messages.blog

export const blogMaintenanceHtml = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${maintenanceTitle}</title>
<style>
body{margin:0;font:1rem system-ui,sans-serif;color:#09101c;background:#fff}
main{padding:4rem 1.5rem;text-align:center}
h1{font-size:1.5rem}
p{color:#647084}
a{color:#255dd6}
</style>
<main>
<h1>${maintenanceTitle}</h1>
<p>${maintenanceDescription}</p>
<a href="">${retryArticle}</a>
</main>
</html>`

export function blogMaintenanceResponse() {
  return new Response(blogMaintenanceHtml, {
    status: 503,
    headers: blogMaintenanceHeaders,
  })
}
