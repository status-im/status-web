'use client'

import { useState } from 'react'

import { Tag } from '@status-im/components'
import { ChevronDownIcon, ExternalIcon } from '@status-im/icons/20'
import { TwitterIcon } from '@status-im/icons/social'
import { Button, ButtonLink } from '@status-im/status-network/components'
import { cx } from 'cva'

import { HubLayout } from '~components/hub-layout'

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all-apps')
  const [openCategories, setOpenCategories] = useState(false)

  const tags = [
    { id: 'all-apps', label: '🧩 All apps' },
    { id: 'ai', label: '✨ AI' },
    { id: 'bridge', label: '🚗 Bridge' },
    { id: 'community', label: '🐕 Community' },
    { id: 'defi', label: '📈 DeFi' },
    { id: 'gaming', label: '🎮 Gaming' },
    { id: 'infra', label: '💻 Infra' },
    { id: 'nft', label: '🖼️ NFT' },
    { id: 'payment', label: '💰 Payment' },
    { id: 'privacy', label: '🕵️ Privacy' },
    { id: 'social', label: '☕ Social' },
    { id: 'spending', label: '🐷 Spending' },
    { id: 'tooling', label: '☂️ Tooling' },
    { id: 'wallet', label: '💎 Wallet' },
  ]

  const tabs = [
    { id: 'popular', label: 'Popular' },
    { id: 'new', label: 'New' },
    { id: 'all', label: 'All' },
  ]

  const featured = [
    {
      id: 1,
      name: 'Cat Fishing',
      category: 'Community',
      status: 'Live',
      description: 'You love cats, cats love fish.',
      website: 'https://cats.fishing',
      twitter: 'catsfishings',
      icon: '/apps/cats-fishing-avatar.png',
      cover: '/apps/cats-fishing-cover.png',
    },
    {
      id: 2,
      name: 'Status Network Bridge',
      category: 'Social',
      status: 'Live',
      description: 'Saving for gas? We’ve got you covered!',
      website: 'https://bridge.status.network',
      twitter: 'StatusL2',
      icon: '/apps/status-network-bridge-avatar.png',
      cover: '/apps/status-network-bridge-cover.png',
    },
    {
      id: 3,
      name: 'Hash Vegas',
      category: 'Gaming',
      status: 'Live',
      description: ' Fair and transparent onchain gaming',
      website: 'https://hashvegas.casino',
      twitter: 'Hashvegas_Offi',
      icon: '/apps/hashvegas-avatar.png',
      cover: '/apps/hashvegas-cover.png',
    },
  ]

  // Simple app data for demonstration
  const apps = [
    {
      id: 1,
      name: 'Paw-sitive Vibes',
      category: 'Community',
      status: 'Live',
      description: 'Join the community that supports animal welfare!',
      website: 'https://paw-sitive.vibes',
      cover: '/apps/paw-sitive-vibes-cover.png',
      icon: '/apps/paw-sitive-vibes-avatar.png',
    },
    {
      id: 2,
      name: 'Whiskers & Waves',
      category: 'Social',
      status: 'Live',
      description: 'Surf the web with a feline twist',
      website: 'https://whiskers.waves',
      cover: '/apps/whiskers-waves-cover.png',
      icon: '/apps/whiskers-waves-avatar.png',
    },
    {
      id: 3,
      name: 'Feline Friends',
      category: 'Social',
      status: 'Live',
      description: 'A social platform for cat lovers to connect',
      website: 'https://feline-friends.com',
      cover: '/apps/feline-friends-cover.png',
      icon: '/apps/feline-friends-avatar.png',
    },
    {
      id: 4,
      name: 'KittyCoin',
      category: 'DeFi',
      status: 'Live',
      description: 'The cryptocurrency for cat enthusiasts',
      website: 'https://kittycoin.org',
      cover: '/apps/kittycoin-cover.png',
      icon: '/apps/kittycoin-avatar.png',
    },
    {
      id: 5,
      name: 'Meow Marketplace',
      category: 'NFT',
      status: 'Live',
      description: 'Buy, sell, and trade cat-related goods',
      website: 'https://meow.marketplace',
      cover: '/apps/meow-marketplace-cover.png',
      icon: '/apps/meow-marketplace-avatar.png',
    },
    {
      id: 6,
      name: 'Fur-tastic Adventures',
      category: 'Gaming',
      status: 'Live',
      description: 'Documenting the adventures of cats',
      website: 'https://furtastic.tube',
      cover: '/apps/furtastic-adventures-cover.png',
      icon: '/apps/furtastic-adventures-avatar.png',
    },
    {
      id: 7,
      name: 'Cats on Canvas',
      category: 'NFT',
      status: 'Live',
      description: 'Art inspired by our furry friends',
      website: 'https://cats.on.canvas',
      cover: '/apps/cats-on-canvas-cover.png',
      icon: '/apps/cats-on-canvas-avatar.png',
    },
    {
      id: 8,
      name: 'Pawse',
      category: 'Social',
      status: 'Live',
      description: "Cat's first music platform",
      website: 'https://pawse.fm',
      cover: '/apps/pawse-cover.png',
      icon: '/apps/pawse-avatar.png',
    },
    {
      id: 9,
      name: 'Cuddle Club',
      category: 'Community',
      status: 'Live',
      description: 'A subscription box for cat lovers and their pets',
      website: 'https://cuddleclub.com',
      cover: '/apps/cuddleclub-cover.png',
      icon: '/apps/cuddleclub-avatar.png',
    },
  ]

  const getCurrentApps = () => {
    return apps // For now, return all apps regardless of tab
  }

  const currentApps = getCurrentApps()

  return (
    <HubLayout>
      <div className="flex h-full flex-col p-8">
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
              <Button variant="white" size="32">
                Get featured
              </Button>
            </div>

            {/* Featured Apps Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map(app => (
                <DiscoverAppCard key={app.id} {...app} />
              ))}
            </div>
          </div>

          <div className="">
            {/* Header with Title and Sorting Options */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-27 font-600 text-neutral-100">All Apps</h2>

              <div className="flex items-center gap-3">
                {/* Sorting Options */}
                <div className="flex gap-3">
                  {tabs.map(tab => (
                    <Button
                      variant="grey"
                      size="32"
                      key={tab.id}
                      active={activeTab === tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        console.log('active tab', tab.id)
                      }}
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
                {tags.map(tag => (
                  <Tag
                    key={tag.id}
                    onPress={() => setSelectedTag(tag.id)}
                    selected={selectedTag === tag.id}
                    label={tag.label}
                    size="32"
                  />
                ))}
              </div>
            </div>

            {/* Apps Grid */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentApps.map(app => (
                <DiscoverAppCard key={app.id} {...app} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </HubLayout>
  )
}

type DiscoverAppCardProps = {
  name: string
  description: string
  website: string
  twitter?: string
}

const DiscoverAppCard = (props: DiscoverAppCardProps) => {
  const { name, description, website, twitter } = props

  return (
    <div className="rounded-28 border border-neutral-20 bg-white-100 p-2 shadow-2 transition-colors hover:border-neutral-30">
      {/* placeholder for cover image */}
      <div className="relative mb-4 flex aspect-[12/5] w-full items-center justify-center rounded-24 bg-neutral-20">
        <span className="rotate-[330deg] text-27 text-neutral-40">
          Placeholder
        </span>
        <div className="absolute bottom-[-15px] left-2 flex size-20 items-center justify-center rounded-24 bg-neutral-40 text-11 text-neutral-60">
          <span className="rotate-45">Placeholder</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-2 pb-2 pt-[10px]">
        <h3 className="mb-1 text-27 font-semibold text-neutral-90">{name}</h3>
        <p className="text-15 font-400 text-neutral-100">{description}</p>
        <div className="flex items-start gap-2">
          <ButtonLink
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            variant="white"
            size="32"
          >
            {website.replace('https://', '')}{' '}
            <ExternalIcon className="size-4 text-neutral-50" />
          </ButtonLink>
          {twitter && (
            <ButtonLink
              href={`https://x.com/${twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="white"
              size="32"
            >
              <TwitterIcon className="size-4 text-neutral-50" />
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  )
}
