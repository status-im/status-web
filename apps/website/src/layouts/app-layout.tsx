import { Footer } from '@/components/footer/footer'
import { FooterMobile } from '@/components/footer/footer-mobile'
import { FloatingMenuDesktop } from '@/components/navigation/floating-menu-desktop'
import { FloatingMenuMobile } from '@/components/navigation/floating-menu-mobile'
import { NavDesktop } from '@/components/navigation/nav-desktop'
import { NavMobile } from '@/components/navigation/nav-mobile'

import type { ReactElement, ReactNode } from 'react'

type Props = {
  hasPreFooter?: boolean
  page: ReactElement
}
export const AppLayout = (props: Props): ReactNode => {
  const hasPreFooter = props?.hasPreFooter

  return (
    <>
      <FloatingMenuDesktop />
      <FloatingMenuMobile />
      <div className=" min-h-full bg-neutral-100">
        <NavDesktop />
        <NavMobile />

        {/* ROUNDED WHITE BG */}
        <div className="flex justify-center">
          <div className="bg-white-100 mx-1 min-h-[900px] w-full max-w-[1504px] rounded-3xl">
            {props.page}
          </div>
        </div>
        {hasPreFooter && (
          <div className="border-l-customisation-orange-50 mx-1 min-h-[900px] w-full max-w-[1504px] rounded-3xl">
            This is the prefooter
          </div>
        )}
        <Footer noBorderTop={!hasPreFooter} />
        <FooterMobile />
      </div>
    </>
  )
}
