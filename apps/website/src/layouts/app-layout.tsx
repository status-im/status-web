import { Footer } from '@/components/footer/footer'
import { FooterMobile } from '@/components/footer/footer-mobile'
import { FloatingMenuDesktop } from '@/components/navigation/floating-menu-desktop'
import { FloatingMenuMobile } from '@/components/navigation/floating-menu-mobile'
import { NavDesktop } from '@/components/navigation/nav-desktop'
import { NavMobile } from '@/components/navigation/nav-mobile'
import { Prefooter } from '@/components/pre-footer'

import type { ReactElement } from 'react'

type AppLayoutProps = {
  hasPreFooter?: boolean
  children: ReactElement
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  hasPreFooter = true,
  children,
}) => {
  return (
    <>
      <FloatingMenuDesktop />
      <FloatingMenuMobile />
      <div className="min-h-full w-full bg-neutral-100">
        <NavDesktop />
        <NavMobile />

        {/* ROUNDED WHITE BG */}
        <div className="flex justify-center lg:p-1">
          {/* TODO Check max-width to use */}
          <div className="bg-white-100 min-h-[900px] w-full rounded-3xl">
            {children}
          </div>
        </div>
        {hasPreFooter && <Prefooter />}
        <Footer hasBorderTop={hasPreFooter} />
        <FooterMobile hasBorderTop={hasPreFooter} />
      </div>
    </>
  )
}
