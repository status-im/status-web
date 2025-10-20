import { getLatestRelease } from '~server/services/github'

import { Footer } from './_components/footer'
import { FloatingMenu } from './_components/navigation/floating-menu'
import { NavDesktop } from './_components/navigation/nav-desktop'
import { NavMobile } from './_components/navigation/nav-mobile'
import { ParallaxProvider } from './_components/parallax'
import { Prefooter } from './_components/pre-footer'
import { WebsiteProvider } from './_provider'

type Props = {
  children: React.ReactNode
}

export const revalidate = 3600 // 1 hour

export default async function WebsiteLayout(props: Props) {
  const { children } = props

  const [mobileRelease, desktopRelease] = await Promise.all([
    getLatestRelease({ repo: 'status-mobile' }),
    getLatestRelease({ repo: 'status-desktop' }),
  ]).catch(error => {
    console.error('Failed to fetch GitHub releases', error)
    return [null, null]
  })

  return (
    <WebsiteProvider
      mobileRelease={mobileRelease}
      desktopRelease={desktopRelease}
    >
      <FloatingMenu />
      <NavDesktop />
      <NavMobile />
      <ParallaxProvider>
        <div className="flex flex-1 flex-col overflow-x-clip xl:px-1 xl:pb-1">
          {children}
        </div>
      </ParallaxProvider>

      <Prefooter />
      <Footer />

      <script
        suppressHydrationWarning
        // nonce={typeof window === 'undefined' ? nonce : ''}
        dangerouslySetInnerHTML={{
          __html: `(${platformScript.toString()})()`,
        }}
      />
    </WebsiteProvider>
  )
}

// inspired by the implementation of next-themes
// https://github.com/pacocoursey/next-themes/blob/main/next-themes/src/index.tsx
const platformScript = () => {
  // if ('userAgentData' in window.navigator && window.navigator.userAgentData) {
  //   const platform = window.navigator.userAgentData.platform.toLowerCase()
  //   if (platform.includes('mac')) {
  //     document.body.setAttribute('data-platform', 'macos')
  //   } else if (platform.includes('win')) {
  //     document.body.setAttribute('data-platform', 'windows')
  //   } else if (platform.includes('linux')) {
  //     document.body.setAttribute('data-platform', 'linux')
  //   }
  // }

  const userAgent = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(userAgent)) {
    document.body.setAttribute('data-platform', 'ios')
  } else if (userAgent.includes('mac')) {
    document.body.setAttribute('data-platform', 'macos')
  } else if (userAgent.includes('win')) {
    document.body.setAttribute('data-platform', 'windows')
  } else if (userAgent.includes('android')) {
    document.body.setAttribute('data-platform', 'android')
  } else if (userAgent.includes('linux')) {
    document.body.setAttribute('data-platform', 'linux')
  } else {
    document.body.setAttribute('data-platform', 'unknown')
  }
}
