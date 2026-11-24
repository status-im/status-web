import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vercelConfig from '../vercel.json' with { type: 'json' }

const { redirects } = vercelConfig
const out = fileURLToPath(new URL('../out/', import.meta.url))

function assertPublishedBlogPages() {
  const publishedRef = 'refs/status-network/published'
  execFileSync(
    'git',
    [
      'fetch',
      '--no-tags',
      '--no-write-fetch-head',
      '--depth=1',
      '--filter=blob:none',
      'https://github.com/status-im/status-web.git',
      `+refs/heads/deploy-status-network-main:${publishedRef}`,
    ],
    { stdio: 'inherit' },
  )

  const redirectedPaths = new Set(redirects.map(({ source }) => source))
  const sitemap = readFileSync(path.join(out, 'sitemap.xml'), 'utf8')
  const missingPaths = []
  const unlistedPaths = []
  let expectedPages = 0
  for (const blogDir of ['blog', 'ko/blog']) {
    const files = execFileSync(
      'git',
      [
        'ls-tree',
        '--full-tree',
        '-r',
        '-z',
        '--name-only',
        `${publishedRef}:${blogDir}`,
      ],
      { encoding: 'utf8' },
    ).split('\0')

    const slugs = new Set()
    for (const file of files) {
      const slug = file.match(/^([^/]+)(?:\.html|\/index\.html)$/)?.[1]
      if (slug && file !== 'index.html') slugs.add(slug)
    }
    if (slugs.size === 0) {
      throw new Error(
        `The published Status Network ${blogDir} has no articles.`,
      )
    }

    for (const slug of slugs) {
      const route = `/${blogDir}/${slug}`
      if (redirectedPaths.has(route)) continue

      expectedPages++
      const htmlPath = path.join(out, blogDir, `${slug}.html`)
      if (
        !existsSync(htmlPath) ||
        !/<article[\s>]/.test(readFileSync(htmlPath, 'utf8'))
      ) {
        missingPaths.push(route)
      } else if (
        blogDir === 'blog' &&
        !sitemap.includes(`<loc>https://status.network${route}</loc>`)
      ) {
        unlistedPaths.push(route)
      }
    }
  }

  if (missingPaths.length > 0) {
    throw new Error(
      `Status Network export is missing published blog pages:\n${missingPaths.join('\n')}`,
    )
  }
  if (unlistedPaths.length > 0) {
    throw new Error(
      `Status Network sitemap is missing exported blog pages:\n${unlistedPaths.join('\n')}`,
    )
  }

  console.log(`Verified ${expectedPages} previously published blog pages.`)
}

if (process.env.REQUIRE_NETWORK_BLOG === '1') {
  assertPublishedBlogPages()
}

for (const { source, destination } of redirects) {
  // GitHub Pages serves files only. Vercel also sends the configured HTTP 301.
  const target = new URL(destination).href
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
  const html = `<!doctype html>
<html lang="${source.startsWith('/ko/') ? 'ko' : 'en'}">
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${target}">
<link rel="canonical" href="${target}">
<title>Status Blog</title>
<a href="${target}">Status Blog</a>
</html>
`
  const directory = path.join(out, source)
  mkdirSync(directory, { recursive: true })
  writeFileSync(`${directory}.html`, html)
  writeFileSync(path.join(directory, 'index.html'), html)
}
