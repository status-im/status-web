'use client'

import { HubLayout } from '~components/hub-layout'

export default function KarmaPage() {
  return (
    <HubLayout>
      <div className="flex h-full flex-col p-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-40 font-semibold leading-[44px] tracking-[-0.8px] text-neutral-90">
            Karma
          </h1>
          <p className="text-19 leading-[1.35] tracking-[-0.304px] text-neutral-60">
            Stake SNT to increase your Karma and unlock gasless transactions
          </p>
        </div>

        {/* Main Content */}
        <div className="mx-auto w-full max-w-[1176px]">
          {/* Karma Visual Card */}
          <div className="mb-12">
            <div className="rounded-20 border border-neutral-20 bg-white-100 p-8 shadow-2">
              <div className="flex items-center justify-between">
                {/* Left Side - Karma Info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="mb-2 text-64 font-bold text-neutral-90">
                      55,129.16 KARMA
                    </div>
                    <div className="text-19 font-medium text-neutral-70">
                      Level 3 Kanji
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="mb-3 flex justify-between text-13 font-medium text-neutral-60">
                      <span>lv 1</span>
                      <span>lv 2</span>
                      <span>lv 3</span>
                      <span>lv 4</span>
                      <span>lv 5</span>
                    </div>
                    <div className="mb-2 h-3 w-full rounded-full bg-neutral-10">
                      <div className="h-full w-3/5 rounded-full bg-purple"></div>
                    </div>
                    <div className="flex justify-between text-13 text-neutral-50">
                      <span>0</span>
                      <span>25,000</span>
                      <span>50,000</span>
                      <span>75,000</span>
                      <span>100,000</span>
                    </div>
                  </div>

                  <div className="mb-6 text-19 font-medium text-neutral-70">
                    # 512
                  </div>

                  {/* Action Tags */}
                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-16 bg-customisation-purple-50/10 px-3 py-2 text-13 font-medium text-purple">
                      Serial Staker
                    </span>
                    <span className="rounded-16 bg-customisation-purple-50/10 px-3 py-2 text-13 font-medium text-purple">
                      Bridge Master
                    </span>
                    <span className="rounded-16 bg-customisation-purple-50/10 px-3 py-2 text-13 font-medium text-purple">
                      Liquidity Duck
                    </span>
                    <span className="rounded-16 bg-customisation-purple-50/10 px-3 py-2 text-13 font-medium text-purple">
                      Hype Catalyst
                    </span>
                  </div>
                </div>

                {/* Right Side - Karma Visual */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-danger-50 to-customisation-orange-50">
                      <div className="text-40">🔥</div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-white-100 shadow-1">
                      <svg
                        className="size-5 text-neutral-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Karma Breakdown Section */}
          <div className="mb-12">
            <h2 className="mb-6 text-27 font-bold text-neutral-90">
              Karma breakdown
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Bridging */}
              <div className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2">
                <div className="mb-4 text-center">
                  <div className="mb-2 text-40 font-bold text-neutral-90">
                    240.20 KARMA
                  </div>
                  <div className="text-19 text-neutral-60">
                    Earned through bridging
                  </div>
                </div>
                <button className="mb-4 w-full rounded-16 bg-purple px-4 py-3 text-19 font-medium text-white-100 transition-colors hover:bg-purple-dark">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Bridge
                  </div>
                </button>
                <div className="text-center">
                  <div className="mb-1 text-15 font-semibold text-purple">
                    Bridge Master
                  </div>
                  <div className="text-13 text-neutral-60">
                    Bridge 871.84 SNT to level up
                  </div>
                </div>
              </div>

              {/* Staking */}
              <div className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2">
                <div className="mb-4 text-center">
                  <div className="mb-2 text-40 font-bold text-neutral-90">
                    40,240.20 KARMA
                  </div>
                  <div className="text-19 text-neutral-60">
                    Earned through staking
                  </div>
                </div>
                <button className="mb-4 w-full rounded-16 bg-purple px-4 py-3 text-19 font-medium text-white-100 transition-colors hover:bg-purple-dark">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Stake
                  </div>
                </button>
                <div className="text-center">
                  <div className="mb-1 text-15 font-semibold text-purple">
                    Serial Staker
                  </div>
                  <div className="text-13 text-neutral-60">
                    Stake 871.84 SNT to level up
                  </div>
                </div>
              </div>

              {/* Promoting */}
              <div className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2">
                <div className="mb-4 text-center">
                  <div className="mb-2 text-40 font-bold text-neutral-90">
                    40,240.20 KARMA
                  </div>
                  <div className="text-19 text-neutral-60">
                    Earned through promoting
                  </div>
                </div>
                <button className="mb-4 w-full rounded-16 bg-purple px-4 py-3 text-19 font-medium text-white-100 transition-colors hover:bg-purple-dark">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Invite
                  </div>
                </button>
                <div className="text-center">
                  <div className="mb-1 text-15 font-semibold text-purple">
                    Hype Catalyst
                  </div>
                  <div className="text-13 text-neutral-60">
                    Invite 5 friends to level up
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="mb-12">
            <h2 className="mb-6 text-27 font-bold text-neutral-90">
              Leaderboard
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Best Overall */}
              <div className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2">
                <h3 className="mb-4 text-19 font-semibold text-neutral-90">
                  Best overall
                </h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'cyp.eth', karma: '3.5M KARMA' },
                    { rank: 2, name: '0xf5d3...A01', karma: '1.2M KARMA' },
                    { rank: 3, name: 'sherali.eth', karma: '0.1M KARMA' },
                    { rank: 4, name: '0x7c8f...c9b', karma: '0.8M KARMA' },
                    { rank: 5, name: '0x7c8f...53b', karma: '0.6M KARMA' },
                  ].map(entry => (
                    <div
                      key={entry.rank}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-neutral-10 text-13 font-medium text-neutral-70">
                          {entry.rank}
                        </div>
                        <span className="text-19 font-medium text-neutral-90">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-19 font-medium text-neutral-70">
                        {entry.karma}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Gainers for Week */}
              <div className="rounded-20 border border-neutral-20 bg-white-100 p-6 shadow-2">
                <h3 className="mb-4 text-19 font-semibold text-neutral-90">
                  Top gainers for week
                </h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: '0x7c8f...c9b', karma: '+ 532 KARMA' },
                    { rank: 2, name: '0x7c8f...53b', karma: '+ 192 KARMA' },
                    { rank: 3, name: 'sherali.eth', karma: '+ 146 KARMA' },
                    { rank: 4, name: 'cyp.eth', karma: '+ 98 KARMA' },
                    { rank: 5, name: '0xf5d3...A01', karma: '+ 87 KARMA' },
                  ].map(entry => (
                    <div
                      key={entry.rank}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-neutral-10 text-13 font-medium text-neutral-70">
                          {entry.rank}
                        </div>
                        <span className="text-19 font-medium text-neutral-90">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-19 font-medium text-success-60">
                        {entry.karma}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HubLayout>
  )
}
