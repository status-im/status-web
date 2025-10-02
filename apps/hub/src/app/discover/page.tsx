'use client'

import { useMemo, useState } from 'react'

import { Tag } from '@status-im/components'
import { ChevronDownIcon } from '@status-im/icons/20'
import { Button, ButtonLink } from '@status-im/status-network/components'
import { cx } from 'cva'

import { categories } from '~/constants/categories'
import { tabs } from '~/constants/tabs'
import { apps } from '~/data/apps'
import { featuredApps } from '~/data/featured-apps'
import { AppCard } from '~components/app-card'
import { HubLayout } from '~components/hub-layout'

export default function DiscoverPage() {
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
      <div className="flex flex-col p-8">
        {/* Main Content */}
        <div className="mx-auto mt-6 flex w-full max-w-[1176px] flex-col gap-8">
          {/* Hero Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-40 font-bold text-neutral-90">
              Gasless apps FTW
            </h1>
            <p className="text-19 text-neutral-60">
              Explore curated dApps and services built on Status Network
            </p>
          </div>

          {/* Featured Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-27 font-600 text-neutral-100">Featured</h2>
              {/* TODO: Add link to typeform */}
              <ButtonLink variant="white" size="32" href="https://typeform.com">
                Get featured
              </ButtonLink>
            </div>

            {/* Featured Apps Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredApps.map(app => (
                <AppCard key={app.id} {...app} />
              ))}
            </div>
          </div>

          <div className="">
            {/* Header with Title and Sorting Options */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-27 font-600 text-neutral-100">
                {activeTab === 'popular'
                  ? 'Popular Apps'
                  : activeTab === 'new'
                    ? 'New Apps'
                    : 'All Apps'}
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
                      {tab.label}
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
                  Categories
                </Button>
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className={cx('mb-8', openCategories ? 'block' : 'hidden')}>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Tag
                    key={category.id}
                    onPress={() => setSelectedTag(category.id)}
                    selected={selectedTag === category.id}
                    label={category.label}
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
                    No apps found
                  </p>
                  <p className="text-15 text-neutral-40">
                    Try adjusting your filters to see more apps
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
