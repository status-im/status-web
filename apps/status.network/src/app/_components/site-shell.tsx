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
    <>
      <PromoBar />
      <div className="relative flex min-h-screen justify-center overflow-clip px-2 2xl:px-0">
        <div className="relative w-full max-w-[1418px] border-x border-neutral-20">
          <div className="absolute -left-2 top-0 z-50 h-full w-2 bg-gradient-to-r from-white-100 to-[transparent] 2xl:-left-12 2xl:w-12" />
          <div className="absolute -right-2 top-0 z-50 h-full w-2 bg-gradient-to-l from-white-100 to-[transparent] 2xl:-right-12 2xl:w-12" />
          <NavBar />
          <NavBarMobile />
          {children}
          <Divider />
          <Footer />
        </div>
      </div>
    </>
  )
}
