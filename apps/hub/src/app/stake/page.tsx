'use client'

import { HubLayout } from '~components/hub-layout'

export default function StakePage() {
  return (
    <HubLayout>
      <div className="flex h-full flex-col p-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-40 font-semibold leading-[44px] tracking-[-0.8px] text-neutral-90">
            Staking is good for karma
          </h1>
          <p className="text-19 leading-[1.35] tracking-[-0.304px] text-neutral-60">
            Stake SNT to increase your Karma and unlock gasless transactions
          </p>
        </div>

        {/* Main Content */}
        <div className="mx-auto w-full max-w-[1176px]">
          <div className="rounded-lg p-30 bg-neutral-2.5">
            <div className="flex justify-center">
              <div className="bg-white w-[494px] rounded-32 border border-neutral-10 p-8 shadow-[0px_2px_20px_0px_rgba(9,16,28,0.04)]">
                {/* Amount to Stake */}
                <div className="opacity-40 mb-6">
                  <label className="mb-2 block text-13 font-medium text-neutral-50">
                    Amount to stake
                  </label>
                  <div className="bg-white rounded-xl border border-neutral-10 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <input
                          type="text"
                          placeholder="0"
                          className="w-full border-none bg-transparent text-27 font-semibold leading-[32px] tracking-[-0.567px] text-neutral-40 outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="to-purple-50 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-50">
                            <span className="text-19 font-semibold text-neutral-90">
                              S
                            </span>
                          </div>
                          <div className="border-white absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 bg-purple">
                            <div className="h-full w-full rounded-full bg-purple"></div>
                          </div>
                        </div>
                        <span className="text-19 font-semibold text-neutral-90">
                          SNT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Select Vault */}
                <div className="opacity-40 mb-6">
                  <label className="mb-2 block text-13 font-medium text-neutral-50">
                    Select vault
                  </label>
                  <div className="bg-white rounded-xl border border-neutral-10 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-15 text-neutral-90">New vault</span>
                      <svg
                        className="h-5 w-5 text-neutral-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  <button className="text-white rounded-xl w-full bg-purple px-4 py-2.5 text-15 font-medium transition-colors hover:bg-purple-dark">
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HubLayout>
  )
}
