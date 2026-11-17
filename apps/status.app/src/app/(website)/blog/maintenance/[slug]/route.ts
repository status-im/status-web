import { getTranslations } from 'next-intl/server'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const [{ slug }, t] = await Promise.all([params, getTranslations('blog')])
  const articleUrl = `/blog/${encodeURIComponent(slug)}`

  return new Response(
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t('maintenanceTitle')}</title>
  <style>
    body { margin: 0; font: 1rem system-ui, sans-serif; color: #09101c; background: #fff; }
    main { padding: 4rem 1.5rem; text-align: center; }
    h1 { font-size: 1.5rem; }
    p { color: #647084; }
    a { color: #255dd6; }
  </style>
</head>
<body>
  <main>
    <h1>${t('maintenanceTitle')}</h1>
    <p>${t('maintenanceDescription')}</p>
    <a href="${articleUrl}">${t('retryArticle')}</a>
  </main>
</body>
</html>`,
    {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Retry-After': '60',
      },
    }
  )
}
