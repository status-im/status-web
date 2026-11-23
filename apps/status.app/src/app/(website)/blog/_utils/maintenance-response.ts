import { blogMaintenanceHeaders } from '~/config/blog-maintenance'

import messages from '../../../../../messages/en.json'

const { maintenanceTitle, maintenanceDescription, retryArticle } = messages.blog

function renderBlogMaintenance(retryPath: string) {
  return `<!doctype html>
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
<a href="${retryPath}">${retryArticle}</a>
</main>
</html>`
}

export const blogMaintenanceHtml = renderBlogMaintenance('')

export function blogMaintenanceResponse(retrySegments?: string[]) {
  const retryPath = retrySegments
    ? `/blog/${retrySegments.map(encodeURIComponent).join('/')}`
    : ''

  return new Response(renderBlogMaintenance(retryPath), {
    status: 503,
    headers: retrySegments
      ? { ...blogMaintenanceHeaders, 'Retry-After': '60' }
      : blogMaintenanceHeaders,
  })
}
