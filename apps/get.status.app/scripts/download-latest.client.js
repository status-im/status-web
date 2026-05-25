/**
 * Fetches the latest status-app GitHub release and redirects to the matching asset.
 * Loaded by static pages under /api/download/{platform}/.
 */
;(function () {
  var platform = document.body.getAttribute('data-platform')
  var messageEl = document.getElementById('message')
  var fallbackEl = document.getElementById('fallback')

  var CACHE_KEY = 'status-app-latest-release'
  var CACHE_MS = 60 * 60 * 1000
  var RELEASES_URL =
    'https://api.github.com/repos/status-im/status-app/releases/latest'
  var FALLBACK_RELEASE_URL =
    'https://github.com/status-im/status-app/releases/latest'

  function resolveAssetUrl(platformId, assets) {
    for (var i = 0; i < assets.length; i++) {
      var name = assets[i].name
      var url = assets[i].browser_download_url

      switch (platformId) {
        case 'macos-silicon':
          if (name.endsWith('aarch64.dmg')) return url
          break
        case 'macos-intel':
          if (name.endsWith('x86_64.dmg')) return url
          if (name.endsWith('x86_64.7z')) return url
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

  function showError(detail) {
    if (messageEl) {
      messageEl.textContent =
        'Could not start the download automatically. Open the latest release on GitHub.'
    }
    if (fallbackEl) {
      fallbackEl.style.display = 'block'
    }
    if (detail) {
      console.error('[download-latest]', detail)
    }
  }

  function readCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY)
      if (!raw) return null

      var parsed = JSON.parse(raw)
      if (!parsed || Date.now() - parsed.fetchedAt > CACHE_MS) return null

      return parsed.data
    } catch {
      return null
    }
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ fetchedAt: Date.now(), data: data }),
      )
    } catch {
      /* ignore quota errors */
    }
  }

  function fetchLatestRelease() {
    var cached = readCache()
    if (cached) return Promise.resolve(cached)

    return fetch(RELEASES_URL, {
      headers: { Accept: 'application/vnd.github+json' },
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('GitHub API responded with ' + response.status)
      }

      return response.json()
    }).then(function (data) {
      writeCache(data)
      return data
    })
  }

  if (!platform) {
    showError('missing platform')
    return
  }

  fetchLatestRelease()
    .then(function (release) {
      var url = resolveAssetUrl(platform, release.assets || [])

      if (!url) {
        throw new Error('No asset found for platform: ' + platform)
      }

      location.replace(url)
    })
    .catch(function (error) {
      showError(error)
    })

  if (fallbackEl) {
    var link = fallbackEl.querySelector('a')
    if (link) link.href = FALLBACK_RELEASE_URL
  }
})()
