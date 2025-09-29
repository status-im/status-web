import { useEffect, useState } from 'react'

declare global {
  interface Navigator {
    // @see https://github.com/lukewarlow/user-agent-data-types/blob/master/index.d.ts
    userAgentData?: {
      platform: string
    }
  }
}

type Platform = 'macos' | 'windows' | 'linux'

function detectDesktopOS(): Platform | null {
  const platform =
    window.navigator.userAgentData?.platform.toLowerCase() ??
    window.navigator.platform.toLowerCase()

  if (platform.includes('mac')) return 'macos'
  if (platform.includes('win')) return 'windows'
  if (platform.includes('linux')) return 'linux'
  return null
}

export const useDesktopOperatingSystem = () => {
  const [desktopOS, setDesktopOS] = useState<Platform | null>(null)

  useEffect(() => {
    // note: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform#examples deprecated but use cases are still valid
    // note: https://html.spec.whatwg.org/multipage/system-state.html#dom-navigator-platform-dev (e.g. "MacIntel", "Win32", "Linux x86_64", "Linux armv81")
    setDesktopOS(detectDesktopOS())
  }, [])

  return desktopOS
}
