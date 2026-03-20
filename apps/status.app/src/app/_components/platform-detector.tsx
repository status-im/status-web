'use client'

import { useLayoutEffect } from 'react'

export function PlatformDetector() {
  useLayoutEffect(() => {
    const el = document.documentElement
    const userAgent = navigator.userAgent.toLowerCase()

    if (/iphone|ipad|ipod/.test(userAgent)) {
      el.setAttribute('data-platform', 'ios')
    } else if (userAgent.includes('mac')) {
      el.setAttribute('data-platform', 'macos')
    } else if (userAgent.includes('win')) {
      el.setAttribute('data-platform', 'windows')
    } else if (userAgent.includes('android')) {
      el.setAttribute('data-platform', 'android')
    } else if (userAgent.includes('linux')) {
      el.setAttribute('data-platform', 'linux')
    } else {
      el.setAttribute('data-platform', 'unknown')
    }
  }, [])

  return null
}
