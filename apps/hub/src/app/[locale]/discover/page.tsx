'use client'

import { useMemo, useState } from 'react'

import { Tag } from '@status-im/components'
import { ChevronDownIcon } from '@status-im/icons/20'
import { Button, ButtonLink } from '@status-im/status-network/components'
import { cx } from 'cva'
import { useTranslations } from 'next-intl'

import { categories } from '~/constants/categories'
import { tabs } from '~/constants/tabs'
import { apps } from '~/data/apps'
import { featuredApps } from '~/data/featured-apps'
import { AppCard } from '~components/app-card'
import { HubLayout } from '~components/hub-layout'

import { jsonLD, JSONLDScript } from '../../_utils/json-ld'

const breadcrumbListSchema = jsonLD.breadcrumbList([
  {
    name: 'Hub',
    url: 'https://hub.status.network/',
  },
  {
    name: 'Discover',
    url: 'https://hub.status.network/discover',
  },
])

const softwareApplicationSchema = jsonLD.softwareApplication({
  name: 'Status Network App Discovery',
  applicationCategory: 'BlockchainPlatform',
  operatingSystem: 'Web',
  url: 'https://hub.status.network/discover',
  description:
    "Explore decentralized applications running on Status Network's gasless Ethereum Layer 2.",
})

export default function DiscoverPage() {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all-apps')
  const [openCategories, setOpenCategories] = useState(false)

  const currentApps = useMemo(() => {
    return apps.filter(app => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'popular' && app.isPopular) ||
        (activeTab === 'new' && app.isNew)

      const matchesCategory =
        selectedTag === 'all-apps' || app.category.toLowerCase() === selectedTag

      return matchesTab && matchesCategory
    })
  }, [selectedTag, activeTab])

  return (
    <HubLayout>
      <JSONLDScript
        schema={[breadcrumbListSchema, softwareApplicationSchema as any]}
      />
      <div className="flex flex-col p-4 lg:p-8">
        {/* Main Content */}
        <div className="mx-auto mt-6 flex w-full max-w-[1176px] flex-col gap-4 md:gap-8">
          {/* Hero Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-27 font-bold text-neutral-90 lg:text-40">
              {t('discover.title')}
            </h1>
            <p className="text-13 text-neutral-60 lg:text-19">
              {t('discover.description')}
            </p>
          </div>

          {/* Featured Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-19 font-600 text-neutral-100 lg:text-27">
                {t('discover.featured')}
              </h2>
              <ButtonLink
                variant="white"
                size="32"
                href="https://statusnetwork.typeform.com/getfeatured"
              >
                {t('discover.get_featured')}
              </ButtonLink>
            </div>

            {/* Featured Apps Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {featuredApps.map(app => (
                <AppCard key={app.id} {...app} />
              ))}
            </div>
          </div>

          <div className="">
            {/* Header with Title and Sorting Options */}
            <div className="mb-6 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center md:gap-0">
              <h2 className="text-19 font-600 text-neutral-100 lg:text-27">
                {activeTab === 'popular'
                  ? t('discover.popular_apps')
                  : activeTab === 'new'
                    ? t('discover.new_apps')
                    : t('discover.all_apps')}
              </h2>

              <div className="flex items-center gap-3">
                {/* Sorting Options */}
                <div className="flex gap-3">
                  {tabs.map(tab => (
                    <Button
                      variant="grey"
                      size="32"
                      key={tab.id}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {t(`discover.tabs.${tab.id}`)}
                    </Button>
                  ))}
                </div>

                {/* Categories Button */}
                <Button
                  variant="white"
                  size="32"
                  onClick={() => setOpenCategories(!openCategories)}
                  icon={
                    <ChevronDownIcon
                      className={cx(
                        'text-neutral-100',
                        openCategories
                          ? 'rotate-180 transition-transform'
                          : 'rotate-0 transition-transform'
                      )}
                    />
                  }
                >
                  {t('discover.categories')}
                </Button>
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className={cx('mb-8', openCategories ? 'block' : 'hidden')}>
              <div className="flex flex-wrap gap-2" data-customisation="blue">
                {categories.map(category => (
                  <Tag
                    key={category.id}
                    onPress={() => setSelectedTag(category.id)}
                    selected={selectedTag === category.id}
                    label={t(`categories.${category.id}`)}
                    size="32"
                  />
                ))}
              </div>
            </div>

            {/* Apps Grid */}
            {currentApps.length > 0 ? (
              <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentApps.map(app => (
                  <AppCard key={app.id} {...app} />
                ))}
              </div>
            ) : (
              <div className="mb-6 flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-19 font-500 text-neutral-100">
                    {t('discover.no_apps_found')}
                  </p>
                  <p className="text-15 text-neutral-40">
                    {t('discover.no_apps_found_description')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HubLayout>
  )
}
