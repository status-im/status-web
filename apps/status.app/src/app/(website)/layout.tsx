import { unstable_cache } from 'next/cache'

import { getLatestRelease } from '~server/services/github'

import { Footer } from './_components/footer'
import { FloatingMenu } from './_components/navigation/floating-menu'
import { NavDesktop } from './_components/navigation/nav-desktop'
import { NavMobile } from './_components/navigation/nav-mobile'
import { ParallaxProvider } from './_components/parallax'
import { Prefooter } from './_components/pre-footer'
import { PromoBar } from './_components/promo-bar'
import { WebsiteProvider } from './_provider'

type Props = {
  children: React.ReactNode
}

export const revalidate = 3600 // 1 hour

const getCachedLatestRelease = unstable_cache(
  async () => {
    try {
      return await getLatestRelease({ repo: 'status-app' })
    } catch (error) {
      console.error('Failed to fetch GitHub releases', error)
      return null
    }
  },
  ['status-app-latest-release'],
  {
    revalidate: 3600,
  }
)

export default async function WebsiteLayout(props: Props) {
  const { children } = props

  const release = await getCachedLatestRelease()

  return (
    <WebsiteProvider mobileRelease={release} desktopRelease={release}>
      <PromoBar />
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
    </WebsiteProvider>
  )
}
