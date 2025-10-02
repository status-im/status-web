/* eslint-disable import/no-unresolved */
'use client'

import { useEffect, useState } from 'react'

import { Tooltip } from '@status-im/components'
import {
  DropdownIcon,
  ExternalIcon,
  InfoIcon,
  PlaceholderIcon,
} from '@status-im/icons/20'
import { Button, ButtonLink } from '@status-im/status-network/components'
import { ConnectKitButton } from 'connectkit'
import Image from 'next/image'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { HubLayout } from '~components/hub-layout'

import { LaunchIcon, SNTIcon } from '../_components/icons'
import { PromoModal } from '../_components/stake/promo-modal'

export default function StakePage() {
  const [status, setStatus] = useState<
    'unninstalled' | 'disconnected' | 'connected'
  >('unninstalled')
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false)
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      setStatus('connected')
    } else {
      setStatus('disconnected')
    }
  }, [isConnected])

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

                {/* @ts-expect-error - TODO: fix this */}
                <Button className="self-end">
                  <PlaceholderIcon className="text-blur-white/70" />
                  Claim testnet SNT
                </Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1fr)]">
                <div className="flex flex-col rounded-32 border border-neutral-10 bg-white-100 p-6 shadow-2 md:p-8">
                  <div className="flex flex-1 flex-col gap-4">
                    <div
                      className={match(status)
                        .with('connected', () => 'space-y-2')
                        .otherwise(() => 'space-y-2 opacity-[40%]')}
                    >
                      <label
                        htmlFor="stake-amount"
                        className="block text-13 font-medium text-neutral-50"
                      >
                        Amount to stake
                      </label>
                      {match(status)
                        .with('connected', () => (
                          <div className="rounded-16 border border-neutral-20 bg-white-100 px-4 py-3">
                            <div className="flex items-center justify-between">
                              <input
                                id="stake-amount"
                                type="text"
                                inputMode="decimal"
                                value="0"
                                placeholder="0"
                                className="w-full border-none bg-transparent text-27 font-semibold leading-[38px] text-neutral-100 outline-none placeholder:text-neutral-40"
                              />
                              <div className="flex items-center gap-1">
                                <SNTIcon />
                                <span className="text-19 font-semibold text-neutral-80">
                                  SNT
                                </span>
                              </div>
                            </div>
                            <div className="-mx-4 my-3 h-px w-[calc(100%+32px)] bg-neutral-10" />
                            <div className="flex items-center justify-between border-neutral-10 text-13 font-500 text-neutral-50">
                              <span>0</span>
                              <button
                                type="button"
                                className="uppercase text-neutral-100"
                              >
                                MAX 0 SNT
                              </button>
                            </div>
                          </div>
                        ))
                        .otherwise(() => (
                          <div className="rounded-12 border border-neutral-20 bg-white-100 px-5 py-3">
                            <div className="flex items-center justify-between">
                              <input
                                id="stake-amount"
                                type="text"
                                value="0"
                                readOnly
                                className="w-full border-none bg-transparent text-27 font-semibold text-neutral-40 outline-none"
                              />
                              <div className="flex items-center gap-1">
                                <SNTIcon />
                                <span className="text-19 font-semibold text-neutral-80">
                                  SNT
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div
                      className={match(status)
                        .with('connected', () => 'space-y-2')
                        .otherwise(() => 'space-y-2 opacity-[40%]')}
                    >
                      <label
                        htmlFor="vault-select"
                        className="block text-13 font-medium text-neutral-50"
                      >
                        Select vault
                      </label>
                      {match(status)
                        .with('connected', () => (
                          <button
                            type="button"
                            disabled
                            className="flex w-full items-center justify-between rounded-16 border border-neutral-20 bg-white-100 py-[9px] pl-4 pr-3 text-left text-15 font-medium text-neutral-80 transition hover:border-neutral-30 disabled:opacity-[40%]"
                          >
                            <span>New vault</span>
                            <DropdownIcon className="text-neutral-40" />
                          </button>
                        ))
                        .otherwise(() => (
                          <div className="rounded-12 border border-neutral-20 bg-white-100 py-[9px] pl-4 pr-3">
                            <div className="flex items-center justify-between">
                              <span className="text-15">New vault</span>
                              <DropdownIcon className="text-neutral-40" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  {match(status)
                    .with('unninstalled', () => (
                      <PromoModal
                        open={isPromoModalOpen}
                        onClose={() => {
                          setIsPromoModalOpen(false)
                          setStatus('disconnected')
                        }}
                      >
                        {/* @ts-expect-error - TODO: fix this */}
                        <Button
                          className="w-full justify-center"
                          onClick={() => setIsPromoModalOpen(true)}
                        >
                          Connect Wallet
                        </Button>
                      </PromoModal>
                    ))
                    .with('disconnected', () => (
                      <ConnectKitButton.Custom>
                        {({ isConnected, show }) => (
                          // @ts-expect-error - TODO: fix this
                          <Button
                            className="w-full justify-center"
                            onClick={show}
                          >
                            {isConnected
                              ? 'Create new vault'
                              : 'Connect Wallet'}
                          </Button>
                        )}
                      </ConnectKitButton.Custom>
                    ))
                    .with('connected', () => (
                      // @ts-expect-error - TODO: fix this
                      <Button className="w-full justify-center">
                        Create new vault
                      </Button>
                    ))
                    .exhaustive()}
                </div>

                <div className="flex flex-col gap-[18px]">
                  <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
                    <div className="mb-2 flex items-start justify-between">
                      <p className="text-13 font-500 text-neutral-60">
                        Total staked
                      </p>
                    </div>
                    <div className="mb-4 flex items-end gap-2">
                      <SNTIcon />
                      <span className="text-27 font-600">0 SNT</span>
                    </div>
                    <p className="text-13 font-500 text-neutral-40">
                      Next unlock in 356 days
                    </p>
                  </div>

                  <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
                    <div className="mb-2 flex items-start justify-between">
                      <p className="text-13 font-500 text-neutral-60">
                        Weighted aggregated boost
                      </p>
                      <InfoTooltip />
                    </div>
                    <div className="mb-4 flex items-end gap-3">
                      <LaunchIcon className="text-purple" />

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

const InfoTooltip = () => (
  <Tooltip
    delayDuration={150}
    side="top"
    className="border border-neutral-100"
    content={
      <div className="max-w-[286px] space-y-4 p-4">
        <p className="text-13 font-500">
          The longer SNT is staked or locked in vaults, the higher this
          multiplier goes. This rewards long term believers. The maximum
          multiplier is x9.
        </p>

        {/* TODO: change link */}
        <ButtonLink href="https://status.app/" variant="outline" size="24">
          Learn more
          <ExternalIcon className="size-4 text-neutral-50" />
        </ButtonLink>
      </div>
    }
  >
    <InfoIcon className="text-neutral-40" />
  </Tooltip>
)
