'use client'

import { HubLayout } from '~components/hub-layout'
import { useState } from 'react'

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all-apps')

  const tabs = [
    { id: 'popular', label: 'Popular' },
    { id: 'new', label: 'New' },
    { id: 'all', label: 'All' },
  ]

  // Simple app data for demonstration
  const apps = [
    {
      id: 1,
      name: 'Paw-sitive Vibes',
      category: 'Community',
      status: 'Live',
      description: 'Join the community that supports animal welfare!',
      icon: '🐾',
      rating: 4.8,
      users: '2.1M',
    },
    {
      id: 2,
      name: 'Whiskers & Waves',
      category: 'Social',
      status: 'Live',
      description: 'Surf the web with a feline twist',
      icon: '🐱',
      rating: 4.7,
      users: '1.8M',
    },
    {
      id: 3,
      name: 'Feline Friends',
      category: 'Social',
      status: 'Live',
      description: 'A social platform for cat lovers to connect',
      icon: '🐈',
      rating: 4.6,
      users: '950K',
    },
    {
      id: 4,
      name: 'KittyCoin',
      category: 'DeFi',
      status: 'Live',
      description: 'The cryptocurrency for cat enthusiasts',
      icon: '🪙',
      rating: 4.5,
      users: '750K',
    },
    {
      id: 5,
      name: 'Meow Marketplace',
      category: 'NFT',
      status: 'Live',
      description: 'Buy, sell, and trade cat-related goods',
      icon: '🛍️',
      rating: 4.4,
      users: '200K',
    },
    {
      id: 6,
      name: 'Fur-tastic Adventures',
      category: 'Gaming',
      status: 'Live',
      description: 'Documenting the adventures of cats',
      icon: '🚗',
      rating: 4.3,
      users: '120K',
    },
    {
      id: 7,
      name: 'Cats on Canvas',
      category: 'NFT',
      status: 'Live',
      description: 'Art inspired by our furry friends',
      icon: '🎨',
      rating: 4.2,
      users: '80K',
    },
    {
      id: 8,
      name: 'Pawse',
      category: 'Social',
      status: 'Live',
      description: "Cat's first music platform",
      icon: '🎵',
      rating: 4.1,
      users: '50K',
    },
    {
      id: 9,
      name: 'Cuddle Club',
      category: 'Community',
      status: 'Live',
      description: 'A subscription box for cat lovers and their pets',
      icon: '📦',
      rating: 4.0,
      users: '30K',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-green-100 text-green-700'
      case 'beta':
        return 'bg-blue-100 text-blue-700'
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'defi':
        return 'bg-purple-100 text-purple-700'
      case 'nft':
        return 'bg-pink-100 text-pink-700'
      case 'gaming':
        return 'bg-green-100 text-green-700'
      case 'social':
        return 'bg-blue-100 text-blue-700'
      case 'tools':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getCurrentApps = () => {
    return apps // For now, return all apps regardless of tab
  }

  const currentApps = getCurrentApps()

  return (
    <HubLayout>
      <div className="flex h-full flex-col p-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-32 mb-3 font-bold text-neutral-90">Discover</h1>
          <p className="text-19 text-neutral-60">
            Explore new applications and opportunities
          </p>
        </div>

        {/* Main Content */}
        <div className="mx-auto w-full max-w-[1176px]">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-48 mb-4 font-bold text-neutral-90">
              Decentralised + gasless = ❤️
            </h1>
            <p className="text-23 text-neutral-60">
              Explore curated dApps and services built on Status Network
            </p>
          </div>

          {/* Featured Section */}
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-27 font-bold text-neutral-90">Featured</h2>
              <button className="rounded-16 bg-neutral-10 px-4 py-2 text-15 font-medium text-neutral-90 hover:bg-neutral-20">
                Get featured
              </button>
            </div>

            {/* Featured Apps Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Cat Fishing */}
              <div className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2 transition-colors hover:border-neutral-30">
                <div className="mb-4">
                  <div className="to-green-50 mb-4 flex aspect-[16/9] w-full items-center justify-center rounded-16 bg-gradient-to-br from-blue-50">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎣</div>
                      <p className="text-15 font-medium text-neutral-80">
                        Cat Fishing
                      </p>
                    </div>
                  </div>
                  <h3 className="mb-2 text-19 font-semibold text-neutral-90">
                    Cat Fishing
                  </h3>
                  <p className="mb-3 text-15 text-neutral-70">
                    You love cats, cats love fish.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-neutral-10 px-3 py-1 text-13 font-medium text-neutral-90">
                      <a
                        href="https://example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-70"
                      >
                        cats.fishing
                      </a>
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-60 hover:text-neutral-90"
                      >
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                      <button className="text-neutral-60 hover:text-neutral-90">
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Network Bridge */}
              <div className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2 transition-colors hover:border-neutral-30">
                <div className="mb-4">
                  <div className="from-purple-50 to-green-50 mb-4 flex aspect-[16/9] w-full items-center justify-center rounded-16 bg-gradient-to-br">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🌉</div>
                      <p className="text-15 font-medium text-neutral-80">
                        Status Network Bridge
                      </p>
                    </div>
                  </div>
                  <h3 className="mb-2 text-19 font-semibold text-neutral-90">
                    Status Network Bridge
                  </h3>
                  <p className="mb-3 text-15 text-neutral-70">
                    Saving for gas? We've got you covered!
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-neutral-10 px-3 py-1 text-13 font-medium text-neutral-90">
                      <a
                        href="https://example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-70"
                      >
                        bridge.status.network
                      </a>
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-60 hover:text-neutral-90"
                      >
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                      <button className="text-neutral-60 hover:text-neutral-90">
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hash Vegas */}
              <div className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2 transition-colors hover:border-neutral-30">
                <div className="mb-4">
                  <div className="from-purple-50 to-yellow-50 mb-4 flex aspect-[16/9] w-full items-center justify-center rounded-16 bg-gradient-to-br">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎰</div>
                      <p className="text-15 font-medium text-neutral-80">
                        Hash Vegas
                      </p>
                    </div>
                  </div>
                  <h3 className="mb-2 text-19 font-semibold text-neutral-90">
                    Hash Vegas
                  </h3>
                  <p className="mb-3 text-15 text-neutral-70">
                    Fair and transparent onchain gaming
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-neutral-10 px-3 py-1 text-13 font-medium text-neutral-90">
                      <a
                        href="https://example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-70"
                      >
                        hashvegas.casino
                      </a>
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-60 hover:text-neutral-90"
                      >
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                      <button className="text-neutral-60 hover:text-neutral-90">
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L6 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Header with Title and Sorting Options */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-27 font-bold text-neutral-90">All Apps</h2>

            <div className="flex items-center gap-4">
              {/* Sorting Options */}
              <div className="flex space-x-1 rounded-16 bg-neutral-10 p-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-12 px-4 py-2 text-15 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-white bg-neutral-90'
                        : 'text-neutral-90 hover:text-neutral-70'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Categories Button */}
              <button className="flex items-center gap-2 rounded-12 bg-neutral-10 px-4 py-2 text-15 font-medium text-neutral-90 hover:bg-neutral-20">
                Categories
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="mb-8">
            {/* First Row */}
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('all-apps')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'all-apps'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">🧩</span>
                All apps
              </button>
              <button
                onClick={() => setSelectedTag('ai')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'ai'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">✨</span>
                AI
              </button>
              <button
                onClick={() => setSelectedTag('bridge')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'bridge'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">🚗</span>
                Bridge
              </button>
              <button
                onClick={() => setSelectedTag('community')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'community'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">🐕</span>
                Community
              </button>
              <button
                onClick={() => setSelectedTag('defi')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'defi'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">📈</span>
                DeFi
              </button>
              <button
                onClick={() => setSelectedTag('gaming')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'gaming'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">🎮</span>
                Gaming
              </button>
              <button
                onClick={() => setSelectedTag('infra')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'infra'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">💻</span>
                Infra
              </button>
              <button
                onClick={() => setSelectedTag('nft')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'nft'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">🖼️</span>
                NFT
              </button>
              <button
                onClick={() => setSelectedTag('payment')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'payment'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">💰</span>
                Payment
              </button>
              <button
                onClick={() => setSelectedTag('privacy')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'privacy'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">🕵️</span>
                Privacy
              </button>
              <button
                onClick={() => setSelectedTag('social')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'social'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">☕</span>
                Social
              </button>
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('spending')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'spending'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">🐷</span>
                Spending
              </button>
              <button
                onClick={() => setSelectedTag('tooling')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'tooling'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">☂️</span>
                Tooling
              </button>
              <button
                onClick={() => setSelectedTag('wallet')}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-13 font-medium transition-colors ${
                  selectedTag === 'wallet'
                    ? 'text-white bg-neutral-90'
                    : 'bg-neutral-10 text-neutral-90 hover:bg-neutral-20'
                }`}
              >
                <span className="text-15">💎</span>
                Wallet
              </button>
            </div>
          </div>

          {/* Apps Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentApps.map(app => (
              <div
                key={app.id}
                className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2 transition-colors hover:border-neutral-30"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple/20 text-2xl flex size-12 items-center justify-center rounded-full">
                      {app.icon}
                    </div>
                    <div>
                      <h3 className="text-19 font-semibold text-neutral-90">
                        {app.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-11 font-medium ${getCategoryColor(app.category)}`}
                        >
                          {app.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-11 font-medium ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-15 font-medium text-neutral-90">
                        {app.rating}
                      </span>
                      <span className="text-yellow-500">⭐</span>
                    </div>
                    <p className="text-11 text-neutral-60">{app.users} users</p>
                  </div>
                </div>

                <p className="mb-4 text-15 text-neutral-70">
                  {app.description}
                </p>

                <button className="text-white w-full rounded-16 bg-purple px-4 py-3 text-15 font-medium transition-colors hover:bg-purple-dark">
                  Launch App
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HubLayout>
  )
}
