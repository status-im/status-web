import { FloatingMenuDesktop } from '@/components/navigation/floating-menu-desktop'
import { FloatingMenuMobile } from '@/components/navigation/floating-menu-mobile'
import { NavDesktop } from '@/components/navigation/nav-desktop'
import { NavMobile } from '@/components/navigation/nav-mobile'
import { PageFooter } from '@/components/page-footer'

import type { PageLayout } from 'next'

export const AppLayout: PageLayout = page => {
  return (
    <>
      <FloatingMenuDesktop />
      <FloatingMenuMobile />
      <div className=" min-h-full bg-neutral-100">
        <NavDesktop />
        <NavMobile />

        {/* ROUNDED WHITE BG */}
        <div className="flex justify-center">
          <div className="bg-white-100 mx-1 min-h-[900px] max-w-[1504px] rounded-3xl">
            {page}
          </div>
        </div>

        <PageFooter />
      </div>
    </>
  )
}
