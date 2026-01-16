'use client'

import { ExternalIcon } from '@status-im/icons/20'
import { ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'

import { HubLayout } from '~components/hub-layout'
import { PreDepositModal } from '~components/pre-deposit-modal'
import { VaultCard } from '~components/vault-card'
import { VAULTS } from '~constants/index'
import { useVaultSelection } from '~hooks/useVaultSelection'

import { Apps } from '../_components/apps'
import { Hero } from '../_components/hero'
import { RewardsSection } from '../_components/rewards-section'
import { jsonLD, JSONLDScript } from '../_utils/json-ld'

const breadcrumbListSchema = jsonLD.breadcrumbList([
  {
    name: 'Hub',
    url: 'https://hub.status.network/',
  },
])

const softwareApplicationSchema = jsonLD.softwareApplication({
  name: 'Status Network Hub',
  applicationCategory: 'BlockchainPlatform',
  operatingSystem: 'Web',
  url: 'https://hub.status.network',
  description:
    "Central hub for deposits, staking, apps, and reputation on Status Network's gasless Ethereum Layer 2.",
})

export default function HomePage() {
  const {
    selectedVault,
    setSelectedVault,
    defaultVault,
    activeVaults,
    registerRefetch,
    handleDepositSuccess,
    isModalOpen,
  } = useVaultSelection()
  const t = useTranslations()
  const locale = useLocale()
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const docsUrl = `https://docs.status.network${localePrefix}/`

  return (
    <HubLayout>
      <JSONLDScript
        schema={[breadcrumbListSchema, softwareApplicationSchema as any]}
      />
      <div className="flex flex-col p-4 lg:px-6 lg:py-8">
        {/* Hero Section */}
        <Hero />

        {/* Main Content Card */}
        <div className="mx-auto mt-7 w-full max-w-[1176px]">
          <div className="mb-8 rounded-32 p-0 lg:bg-neutral-2.5 lg:p-8">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex flex-col gap-4">
                <h3 className="text-19 font-600 text-neutral-90 lg:text-27">
                  {t('dashboard.deposit_funds_title')}
                </h3>
                <RewardsSection />
              </div>
              <ButtonLink
                variant="outline"
                href="https://status.app/blog/status-network-pre-deposit-vaults-be-early-to-the-gasless-l2"
                className="bg-white-100"
                size="32"
                icon={<ExternalIcon className="text-neutral-50" />}
              >
                {t('common.learn_more')}
              </ButtonLink>
            </div>

            <section className="relative w-full">
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:ml-40 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
                {VAULTS.map(vault => (
                  <div
                    key={vault.id}
                    className="w-[200px] shrink-0 lg:h-full lg:w-auto"
                  >
                    <VaultCard
                      vault={vault}
                      onDeposit={() => setSelectedVault(vault)}
                      registerRefetch={registerRefetch}
                    />
                  </div>
                ))}
              </div>
              <Image
                src="/dragon.png"
                alt="Dragon"
                width="354"
                height="320"
                className="relative m-auto lg:absolute lg:left-[-127px] lg:top-[120px]"
              />
            </section>
          </div>
          <Apps />
        </div>

        <div className="pb-8 pt-4 lg:py-12">
          <div className="flex flex-col items-center justify-center gap-8 text-center lg:flex-row lg:items-center lg:justify-center lg:text-left">
            <div className="order-2 max-w-2xl lg:order-1">
              <h3 className="mb-2 text-27 font-medium text-neutral-90 lg:mb-3 lg:text-64 lg:font-bold">
                {t('dashboard.build_with_us_title')}
              </h3>
              <p className="mb-4 text-13 font-medium text-neutral-60 lg:mb-8 lg:text-27">
                {t('dashboard.build_with_us_description')}
              </p>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <ButtonLink
                  href={docsUrl}
                  variant="primary"
                  size="32"
                  className="text-white-100"
                  icon={<ExternalIcon className="text-blur-white/70" />}
                >
                  {t('dashboard.read_docs')}
                </ButtonLink>

                <ButtonLink
                  href="https://statusnetwork.typeform.com/partner"
                  variant="grey"
                  size="32"
                  className="bg-neutral-10 text-neutral-100"
                  icon={<ExternalIcon className="text-neutral-50" />}
                >
                  {t('dashboard.submit_app')}
                </ButtonLink>
              </div>
            </div>

            <div className="relative order-1 w-full max-w-[420px] lg:order-2">
              <Image
                src="/build-unicorn.png"
                alt="Unicorn"
                width="298"
                height="318"
                className="mx-auto mt-8 lg:mt-0"
              />
            </div>
          </div>
        </div>
      </div>
      <PreDepositModal
        open={isModalOpen}
        onOpenChange={open => !open && setSelectedVault(null)}
        vault={selectedVault ?? defaultVault}
        vaults={activeVaults}
        setActiveVault={setSelectedVault}
        onDepositSuccess={handleDepositSuccess}
      />
    </HubLayout>
  )
}
