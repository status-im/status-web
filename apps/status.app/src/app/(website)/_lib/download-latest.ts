'use client'

import { STATUS_RELEASES_LATEST_URL } from '~/config/routes'

export type DownloadPlatform =
  | 'macos-silicon'
  | 'macos-intel'
  | 'linux'
  | 'windows'
  | 'android'

const CACHE_KEY = 'status-app-latest-release'
const CACHE_MS = 60 * 60 * 1000
const RELEASES_URL =
  'https://api.github.com/repos/status-im/status-app/releases/latest'
const FALLBACK_RELEASE_URL = STATUS_RELEASES_LATEST_URL

type ReleaseAsset = {
  name: string
  browser_download_url: string
}

function resolveAssetUrl(platform: DownloadPlatform, assets: ReleaseAsset[]) {
  for (const { name, browser_download_url: url } of assets) {
    switch (platform) {
      case 'macos-silicon':
        if (name.endsWith('aarch64.dmg')) return url
        break
      case 'macos-intel':
        if (name.endsWith('x86_64.dmg') || name.endsWith('x86_64.7z'))
          return url
        break
      case 'windows':
        if (name.endsWith('.exe')) return url
        break
      case 'linux':
        if (name.endsWith('x86_64.tar.gz')) return url
        break
      case 'android':
        if (name.endsWith('arm64.apk')) return url
        break
    }
  }

  return undefined
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as {
      fetchedAt: number
      data: { assets?: ReleaseAsset[] }
    }
    if (!parsed || Date.now() - parsed.fetchedAt > CACHE_MS) return null

    return parsed.data
  } catch {
    return null
  }
}

function writeCache(data: unknown) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now(), data })
    )
  } catch {
    /* ignore quota errors */
  }
}

async function fetchLatestRelease() {
  const cached = readCache()
  if (cached) return cached

  const response = await fetch(RELEASES_URL, {
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`)
  }

  const data = await response.json()
  writeCache(data)
  return data as { assets?: ReleaseAsset[] }
}

export async function getLatestDownloadUrl(platform: DownloadPlatform) {
  const release = await fetchLatestRelease()
  const url = resolveAssetUrl(platform, release.assets ?? [])

  if (!url) {
    throw new Error(`No asset found for platform: ${platform}`)
  }

  return url
}

export async function startLatestDownload(platform: DownloadPlatform) {
  try {
    const url = await getLatestDownloadUrl(platform)
    window.location.assign(url)
  } catch (error) {
    console.error('[download-latest]', error)
    window.open(FALLBACK_RELEASE_URL, '_blank', 'noopener,noreferrer')
  }
}
