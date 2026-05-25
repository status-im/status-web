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
