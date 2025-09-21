'use client'

import { DropdownIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import Image from 'next/image'

import { HubLayout } from '~components/hub-layout'

export default function StakePage() {
  return (
    <HubLayout>
      <div className="flex h-full flex-col p-8">
        <div className="mx-auto w-full max-w-[1176px]">
          <header className="mb-8 flex flex-col gap-2">
            <h1 className="text-40 font-bold">Stake SNT, receive good Karma</h1>
            <p className="text-19">
              Stake SNT to increase your Karma, unlock more gasless transactions
              and increase your power over the network
            </p>
          </header>

          <section className="rounded-8 bg-neutral-2.5 p-8">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8 rounded-32 border border-neutral-10 bg-white-100 p-6 shadow-2 md:flex-row md:items-center md:justify-between md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="relative h-[88px]">
                    <Image
                      width="103"
                      height="174"
                      src="/piggy-bank.png"
                      alt="Piggy Bank"
                      className="-mt-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-19 font-500">
                        Free Testnet SNT faucet
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-6">
                      <div className="min-w-[128px] space-y-1 text-13 font-500">
                        <p className="text-neutral-50">Daily limit</p>
                        <p>10,000 SNT</p>
                      </div>
                      <div className="min-w-[128px] space-y-1 text-13 font-500">
                        <p className="text-neutral-50">Used today</p>
                        <p>0 SNT</p>
                      </div>
                      <div className="min-w-[128px] space-y-1 text-13 font-500">
                        <p className="text-neutral-50">Available</p>
                        <p>10,000 SNT</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="self-end">Claim testnet SNT</Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
                <div className="flex flex-col rounded-32 border border-neutral-10 bg-white-100 p-6 shadow-2 md:p-8">
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="space-y-2 opacity-[40%]">
                      <label
                        htmlFor="stake-amount"
                        className="block text-13 font-medium text-neutral-50"
                      >
                        Amount to stake
                      </label>
                      <div className="rounded-12 border border-neutral-20 bg-white-100 px-5 py-3">
                        <div className="flex items-center justify-between">
                          <input
                            id="stake-amount"
                            type="text"
                            value="0"
                            readOnly
                            className="w-full border-none bg-transparent text-27 font-semibold text-neutral-60 outline-none"
                          />
                          <div className="flex items-center gap-3">
                            <span className="text-19 font-semibold text-neutral-80">
                              SNT
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 opacity-[40%]">
                      <label
                        htmlFor="vault-select"
                        className="block text-13 font-medium text-neutral-50"
                      >
                        Select vault
                      </label>
                      <div className="rounded-12 border border-neutral-20 bg-white-100 py-[9px] pl-4 pr-3">
                        <div className="flex items-center justify-between">
                          <span className="text-19">New vault</span>
                          <DropdownIcon className="text-neutral-40" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full justify-center">
                    Connect Wallet
                  </Button>
                </div>

                <div className="flex flex-col gap-[18px]">
                  <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-13 font-500 text-neutral-60">
                          Total staked
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 flex items-end gap-3">
                      <div className="size-8 rounded-full bg-customisation-purple-50/20 p-1" />

                      <span className="text-27 font-600">0 SNT</span>
                    </div>
                    <p className="text-13 font-500 text-neutral-40">
                      Next unlock in 356 days
                    </p>
                  </div>

                  <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-13 font-500 text-neutral-60">
                          Weighted aggregated boost
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 flex items-end gap-3">
                      <div className="size-8 rounded-full bg-customisation-purple-50/20 p-1" />

                      <span className="text-27 font-600">x0</span>
                    </div>
                    <p className="text-13 font-500 text-neutral-40">
                      No points are ready to compound
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </HubLayout>
  )
}
