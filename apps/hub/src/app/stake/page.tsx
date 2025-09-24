'use client'

import { useCallback, useState } from 'react'

import { Tooltip, useToast } from '@status-im/components'
import { DropdownIcon, ExternalIcon, InfoIcon } from '@status-im/icons/20'
import { Button, ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'
import { match } from 'ts-pattern'

import { HubLayout } from '~components/hub-layout'
import { PromoModal } from '~components/promo-modal'

import { LaunchIcon } from '../_components/icons'

export default function StakePage() {
  // Simulate wallet connection state
  const [status, setStatus] = useState<
    'unninstalled' | 'unconnected' | 'connected'
  >('unninstalled')
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const toast = useToast()

  const handleConnect = useCallback(async () => {
    if (isConnecting) return

    setIsConnecting(true)

    await new Promise(resolve => setTimeout(resolve, 1200))

    const isSuccess = Math.random() > 0.4

    if (isSuccess) {
      setStatus('connected')
      toast.positive('Wallet connected successfully')
    } else {
      toast.negative('Connection failed. Please try again.')
    }

    setIsConnecting(false)
  }, [isConnecting, toast])

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

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1fr)]">
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
                  {match(status)
                    .with('unninstalled', () => (
                      <PromoModal
                        open={isPromoModalOpen}
                        onClose={() => {
                          setIsPromoModalOpen(false)
                          setStatus('unconnected')
                        }}
                      >
                        <Button
                          className="w-full justify-center"
                          onClick={() => setIsPromoModalOpen(true)}
                        >
                          Connect Wallet
                        </Button>
                      </PromoModal>
                    ))
                    .with('unconnected', () => (
                      <Button
                        className="w-full justify-center"
                        onClick={handleConnect}
                        disabled={isConnecting}
                      >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </Button>
                    ))
                    .with('connected', () => (
                      <Button
                        className="w-full justify-center"
                        onClick={handleConnect}
                        disabled={isConnecting}
                      >
                        Create New Vault
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

const SNTIcon = () => {
  return (
    <div className="relative size-8">
      <Image
        src="/vaults/snt.png"
        alt="SNT"
        width="64"
        height="64"
        quality="100"
      />
      <Image
        src="/tokens/karma.png"
        width="24"
        height="24"
        alt="Karma"
        className="absolute -bottom-0.5 -right-1 size-[14px] rounded-full border-2 border-white-100"
      />
    </div>
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
