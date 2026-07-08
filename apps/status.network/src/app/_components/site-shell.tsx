import { Divider } from './divider'
import { Footer } from './footer'
import { NavBar } from './navbar'
import { NavBarMobile } from './navbar-mobile'
import { PromoBar } from './promo-bar'

type Props = {
  children: React.ReactNode
}

export function SiteShell({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <PromoBar />
      <div className="relative flex min-h-0 flex-1 justify-center px-2 2xl:px-0">
        <div className="relative grid min-h-0 w-full max-w-[1418px] flex-1 grid-rows-[auto_1fr_auto] border-x border-neutral-20">
          <div className="absolute -left-2 top-0 z-50 h-full w-2 bg-gradient-to-r from-white-100 to-[transparent] 2xl:-left-12 2xl:w-12" />
          <div className="absolute -right-2 top-0 z-50 h-full w-2 bg-gradient-to-l from-white-100 to-[transparent] 2xl:-right-12 2xl:w-12" />
          <div>
            <NavBar />
            <NavBarMobile />
          </div>
          <div className="min-h-0">{children}</div>
          <div>
            <Divider />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  )
}
