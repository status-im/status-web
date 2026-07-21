import { Footer } from '~website/_components/footer'
import { FloatingMenu } from '~website/_components/navigation/floating-menu'
import { NavDesktop } from '~website/_components/navigation/nav-desktop'
import { NavMobile } from '~website/_components/navigation/nav-mobile'
import { ParallaxProvider } from '~website/_components/parallax'
import { Prefooter } from '~website/_components/pre-footer'
import { PromoBar } from '~website/_components/promo-bar'
import { WebsiteProvider } from '~website/_provider'

type Props = {
  children: React.ReactNode
}

export default async function WebsiteLayout(props: Props) {
  const { children } = props

  return (
    <WebsiteProvider mobileRelease={null} desktopRelease={null}>
      <div className="flex min-h-dvh flex-col">
        <PromoBar />
        <FloatingMenu />
        <NavDesktop />
        <NavMobile />
        <div className="flex min-h-0 flex-1 flex-col">
          <ParallaxProvider>
            <div className="grid min-h-0 flex-1 grid-rows-[1fr_auto_auto] overflow-x-clip xl:px-1 xl:pb-1">
              <div className="relative flex min-h-0 min-w-0 flex-col">
                {children}
              </div>
              <Prefooter />
              <Footer />
            </div>
          </ParallaxProvider>
        </div>
      </div>
    </WebsiteProvider>
  )
}
