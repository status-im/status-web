import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(APP_ROOT, 'out')
const CLIENT_SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  'download-latest.client.js',
)

const STATUS_MOBILE_APP_STORE_URL =
  'https://apps.apple.com/us/app/status-privacy-super-app/id6754166924'
const STATUS_MOBILE_GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=app.status.mobile&ref=our.status.im'
const MOBILE_FALLBACK_URL = 'https://get.status.app/apps#mobile'

const PLATFORMS = [
  'macos-silicon',
  'macos-intel',
  'linux',
  'windows',
  'android',
]

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
}

function platformRedirectHtml(platform) {
  const safePlatform = escapeHtml(platform)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Redirecting…</title>
</head>
<body data-platform="${safePlatform}">
  <p id="message">Redirecting to the latest download…</p>
  <p id="fallback" style="display: none">
    <a href="https://github.com/status-im/status-app/releases/latest">Download from GitHub</a>
  </p>
  <script src="/download-latest.js"></script>
</body>
</html>`
}

function mobileRedirectHtml() {
  const play = escapeHtml(STATUS_MOBILE_GOOGLE_PLAY_URL)
  const appStore = escapeHtml(STATUS_MOBILE_APP_STORE_URL)
  const fallback = escapeHtml(MOBILE_FALLBACK_URL)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Redirecting…</title>
</head>
<body>
  <p>Redirecting…</p>
  <script>
    (function () {
      var ua = navigator.userAgent || '';
      if (/android/i.test(ua)) {
        location.replace('${play}');
        return;
      }
      if (/iphone|ipad|ipod/i.test(ua)) {
        location.replace('${appStore}');
        return;
      }
      location.replace('${fallback}');
    })();
  </script>
  <noscript>
    <p><a href="${fallback}">View mobile apps</a></p>
  </noscript>
</body>
</html>`
}

function writeRedirect(relativePath, html) {
  const filePath = join(OUT_DIR, relativePath, 'index.html')
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, html, 'utf8')
}

function main() {
  if (!existsSync(OUT_DIR)) {
    console.error('❌ out/ directory not found. Run `pnpm build` first.')
    process.exit(1)
  }

  copyFileSync(CLIENT_SCRIPT, join(OUT_DIR, 'download-latest.js'))

  for (const platform of PLATFORMS) {
    writeRedirect(`api/download/${platform}`, platformRedirectHtml(platform))
    console.info(`✅ api/download/${platform} (client-side latest release)`)
  }

  writeRedirect('api/download/mobile', mobileRedirectHtml())
  console.info('✅ api/download/mobile (user-agent redirect page)')
}

main()
