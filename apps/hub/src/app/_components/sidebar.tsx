'use client'

import { useLocale, useTranslations } from 'next-intl'

import {
  BridgeIcon,
  DepositIcon,
  DiscoverIcon,
  DocsIcon,
  ExplorerIcon,
  HandIcon,
  // HeartIcon,
  // GovernanceIcon,
  HomeIcon,
  KarmaIcon,
  StakeIcon,
  SubmitAppIcon,
} from './icons'
import { LinkItem } from './link-item'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = (props: Props) => {
  const { isOpen, onClose } = props
  const t = useTranslations()
  const locale = useLocale()
  const localePrefix = locale === 'en' ? '' : `/${locale}`

  const NAV_LINKS = [
    {
      id: 'dashboard',
      label: t('navigation.home'),
      icon: HomeIcon,
      href: '/',
    },
    {
      id: 'deposit',
      label: t('navigation.pre_deposits'),
      icon: DepositIcon,
      href: '/pre-deposits',
      tag: t('common.mainnet'),
    },
    {
      id: 'discover',
      label: t('navigation.discover'),
      icon: DiscoverIcon,
      href: '/discover',
    },
    {
      id: 'stake',
      label: t('navigation.stake'),
      icon: StakeIcon,
      href: '/stake',
    },
    {
      id: 'karma',
      label: t('navigation.karma'),
      icon: KarmaIcon,
      href: '/karma',
    },
  ]

  const TOKENS_LINKS = [
    {
      id: 'bridge',
      label: t('navigation.bridge'),
      icon: BridgeIcon,
      href: 'https://bridge.status.network/',
    },
  ]

  const OTHER_LINKS = [
    {
      id: 'snt-vote',
      label: t('navigation.snt_vote'),
      icon: HandIcon,
      href: 'https://snapshot.org/#/s:status.eth/proposals',
    },
    {
      id: 'explorer',
      label: t('navigation.explorer'),
      icon: ExplorerIcon,
      href: 'https://sepoliascan.status.network/',
    },
    // {
    //   id: 'governance',
    //   label: 'Governance',
    //   icon: GovernanceIcon,
    //   href: '/governance',
    // },
    {
      id: 'submit-app',
      label: t('navigation.submit_app'),
      icon: SubmitAppIcon,
      href: 'https://statusnetwork.typeform.com/builder',
    },
    {
      id: 'docs',
      label: t('navigation.docs'),
      icon: DocsIcon,
      href: `https://docs.status.network${localePrefix}/`,
    },
  ]

  const FEEDBACK_LINKS = [
    {
      id: 'contact-us',
      label: t('footer.share_feedback'),
      // icon: HeartIcon,
      href: 'https://statusnetwork.typeform.com/contact-us',
    },
    {
      id: 'submit-bug',
      label: t('footer.submit_bug'),
      href: 'https://github.com/status-im/status-web/issues/new?template=bug_report.md',
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[70] bg-neutral-80/50 lg:hidden"
          onClick={onClose}
          onKeyDown={e => e.key === 'Escape' && onClose()}
          aria-label={t('navigation.close_sidebar')}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] w-72 transform bg-white-100 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-60 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-auto py-8">
          {/* Main Navigation */}
          <nav className="flex-1 px-6 lg:px-0">
            <ul className="space-y-1">
              {NAV_LINKS.map(item => (
                <LinkItem key={item.id} {...item} />
              ))}
            </ul>

            {/* Separator with Title */}
            <div className="my-3">
              <div className="mb-2 px-4">
                <h3 className="text-13 font-medium leading-[1.4] tracking-[-0.3%] text-purple">
                  {t('navigation.tokens')}
                </h3>
              </div>
              <div className="h-px bg-customisation-purple-50/40"></div>
            </div>

            {/* Token Items */}
            <ul className="space-y-1">
              {TOKENS_LINKS.map(item => {
                return <LinkItem key={item.id} {...item} />
              })}
            </ul>

            {/* Separator */}
            <div className="my-3 h-px bg-customisation-purple-50/40"></div>

            {/* Bottom Section */}
            <ul className="space-y-1">
              {OTHER_LINKS.map(item => {
                return <LinkItem key={item.id} {...item} />
              })}
            </ul>

            <div className="my-3 h-px bg-customisation-purple-50/40 lg:hidden"></div>
            <ul className="space-y-1 lg:hidden">
              {FEEDBACK_LINKS.map(item => {
                return <LinkItem key={item.id} {...item} />
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export { Sidebar }
