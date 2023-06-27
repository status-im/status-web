import { Text } from '@status-im/components'
import { ChevronRightIcon } from '@status-im/icons'

import { Footer } from '@/components/footer/footer'
import { FooterMobile } from '@/components/footer/footer-mobile'
import { FloatingMenu } from '@/components/navigation/floating-menu'
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
      <FloatingMenu />
      <div className="min-h-full w-full bg-neutral-100">
        <NavDesktop />
        <NavMobile />

        {/* ROUNDED WHITE BG */}
        <div className="flex justify-center lg:p-1">
          {/* TODO Check max-width to use */}
          <div className="min-h-[900px] w-full rounded-3xl bg-white-100">
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

export const PageBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-1 min-h-[900px] rounded-3xl bg-white-100">
      {children}
    </div>
  )
}

type BreadcrumbsProps = {
  action?: React.ReactNode
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { action = null } = props

  return (
    <div className="flex h-12 items-center justify-between border-b border-neutral-10 px-5">
      <div className="flex gap-3">
        <Text size={15} weight="medium">
          Status Help
        </Text>
        <ChevronRightIcon size={20} />
        <Text size={15} weight="medium">
          Getting started
        </Text>
        <ChevronRightIcon size={20} />
        <Text size={15} weight="medium">
          Amazing document that will helps the user in the app
        </Text>
      </div>

      {action}
    </div>
  )
}

// Breadcrumbs.Item = ({ children, href }) => {}
