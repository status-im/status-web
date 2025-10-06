/* eslint-disable import/no-unresolved */
'use client'

import { useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
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
import { useForm, useWatch } from 'react-hook-form'
import { match } from 'ts-pattern'
import { parseUnits } from 'viem'
import { useAccount, useBalance, useConfig, useReadContract } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'

import { HubLayout } from '~components/hub-layout'

import { SNT_TOKEN, STAKING_MANAGER } from '../../config'
import { statusNetworkTestnet } from '../../config/chain'
import { formatCurrency, formatSNT } from '../../utils/currency'
import { LaunchIcon, SNTIcon } from '../_components/icons'
import { PromoModal } from '../_components/stake/promo-modal'
import { VaultSelect } from '../_components/vault-select'
import { VaultsTable } from '../_components/vaults/table'
import { useAccountVaults } from '../_hooks/useAccountVaults'
import { useExchangeRate } from '../_hooks/useExchangeRate'
import { useFaucetMutation, useFaucetQuery } from '../_hooks/useFaucet'
import { useTokenApproval } from '../_hooks/useTokenApproval'
import { useVaultMutation } from '../_hooks/useVault'
import { useVaultTokenStake } from '../_hooks/useVaultTokenStake'
import { useWeightedBoost } from '../_hooks/useWeightedBoost'
import { useVaultStateContext } from '../_hooks/vault-state-context'
import { stakingManagerAbi, tokenAbi } from '../contracts'

import type { Address } from 'viem'

const createSkakeFormSchema = () => {
  return z.object({
    amount: z.string(),
    vault: z.string(),
  })
}

type FormValues = z.infer<ReturnType<typeof createSkakeFormSchema>>

type ConnectionStatus = 'uninstalled' | 'disconnected' | 'connected'

const TOKEN_TICKER = 'SNT'
// const SUCCESS_TOAST_DURATION_MS = 1500

export default function StakePage() {
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false)

  const { isConnected, address } = useAccount()
  const config = useConfig()

  const { mutate: claimTokens } = useFaucetMutation()
  const { data: faucetData } = useFaucetQuery()
  const { data: vaults } = useAccountVaults()
  const weightedBoost = useWeightedBoost(vaults)
  const { data: exchangeRate } = useExchangeRate()

  const form = useForm<FormValues>({
    resolver: zodResolver(createSkakeFormSchema()),
    mode: 'onChange',
    defaultValues: {
      amount: '',
      vault: '',
    },
  })

  const { data: balance } = useBalance({
    chainId: statusNetworkTestnet.id,
    scopeKey: 'balance',
    address,
    token: SNT_TOKEN.address,
    query: {
      enabled: isConnected,
    },
  })

  const { data: totalStaked } = useReadContract({
    address: STAKING_MANAGER.address,
    abi: stakingManagerAbi,
    functionName: 'totalStaked',
  }) as { data: bigint }

  const { mutate: deployVault } = useVaultMutation()
  const { mutate: approveTokens } = useTokenApproval()
  const { mutate: stakeVault } = useVaultTokenStake()

  // State machine for vault operations
  const { send: sendVaultEvent } = useVaultStateContext()

  const status: ConnectionStatus = useMemo(() => {
    if (isConnected) return 'connected'
    return isPromoModalOpen ? 'uninstalled' : 'disconnected'
  }, [isConnected, isPromoModalOpen])

  // Watch the amount field for changes
  const amountValue = useWatch({
    control: form.control,
    name: 'amount',
    defaultValue: '',
  })

  const amountInUSD = useMemo(() => {
    const amountInputNumber = parseFloat(amountValue || '0')
    if (exchangeRate && !isNaN(amountInputNumber)) {
      return amountInputNumber * exchangeRate.price
    }
    return 0
  }, [amountValue, exchangeRate])

  const handleSubmit = async (data: FormValues) => {
    if (!data.amount || !data.vault || !address) return

    try {
      const amountWei = parseUnits(data.amount, SNT_TOKEN.decimals)

      // Check current allowance
      const currentAllowance = (await readContract(config, {
        address: SNT_TOKEN.address,
        abi: tokenAbi,
        functionName: 'allowance',
        args: [address, data.vault as Address],
      })) as bigint

      // Transition to increase allowance if not enough allowance
      if (amountWei >= currentAllowance) {
        approveTokens(
          {
            amount: data.amount,
            vaultAddress: data.vault as Address,
          },
          {
            onSuccess: () => {
              // After approval completes, proceed to staking
              stakeVault({
                amountWei,
                lockPeriod: 0n,
                vaultAddress: data.vault as Address,
              })
            },
            onError: error => {
              throw error
            },
          }
        )
      } else {
        // Allowance already sufficient, go straight to staking
        stakeVault({
          amountWei,
          lockPeriod: 0n,
          vaultAddress: data.vault as Address,
        })
      }
    } catch (error) {
      sendVaultEvent({ type: 'REJECT' })
      console.error('Failed to check allowance:', error)
    }
  }

  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-8 p-8">
        <header className="flex flex-col gap-2">
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
                    <p className="text-19 font-500">Free Testnet SNT faucet</p>
                  </div>

                  <div className="flex flex-wrap gap-4 md:gap-6">
                    <div className="min-w-[128px] space-y-1 text-13 font-500">
                      <p className="text-neutral-50">Daily limit</p>
                      <span>{formatSNT(faucetData?.dailyLimit ?? 0)} SNT</span>
                    </div>
                    <div className="min-w-[128px] space-y-1 text-13 font-500">
                      <p className="text-neutral-50">Used today</p>
                      <span>
                        {formatSNT(faucetData?.accountDailyRequests ?? 0)} SNT
                      </span>
                    </div>
                    <div className="min-w-[128px] space-y-1 text-13 font-500">
                      <p className="text-neutral-50">Available</p>
                      <span>
                        {formatSNT(faucetData?.remainingRequests ?? 0)} SNT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* @ts-expect-error - TODO: fix this */}
              <Button
                className="self-end"
                disabled={!faucetData?.canRequest}
                onClick={claimTokens}
              >
                <PlaceholderIcon className="text-blur-white/70" />
                Claim testnet {TOKEN_TICKER}
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1fr)]">
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4 rounded-32 border border-neutral-10 bg-white-100 p-6 shadow-2 md:p-8"
              >
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
                              {...form.register('amount')}
                              placeholder="0"
                              className="w-full border-none bg-transparent text-27 font-semibold leading-[38px] text-neutral-100 outline-none placeholder:text-neutral-40"
                            />
                            <div className="flex items-center gap-1">
                              <SNTIcon />
                              <span className="text-19 font-semibold text-neutral-80">
                                {TOKEN_TICKER}
                              </span>
                            </div>
                          </div>
                          <div className="-mx-4 my-3 h-px w-[calc(100%+32px)] bg-neutral-10" />
                          <div className="flex items-center justify-between border-neutral-10 text-13 font-500 text-neutral-50">
                            <span>{formatCurrency(amountInUSD)}</span>
                            <button
                              type="button"
                              onClick={() =>
                                form.setValue(
                                  'amount',
                                  formatSNT(balance?.value ?? 0)
                                )
                              }
                              className="uppercase text-neutral-100"
                            >
                              {`MAX ${formatSNT(balance?.value ?? 0)} ${TOKEN_TICKER}`}
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
                                {TOKEN_TICKER}
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
                        <VaultSelect
                          vaults={vaults ?? []}
                          value={form.watch('vault')}
                          onChange={value => form.setValue('vault', value)}
                        />
                      ))
                      .otherwise(() => (
                        <div className="rounded-12 border border-neutral-20 bg-white-100 py-[9px] pl-4 pr-3">
                          <div className="flex items-center justify-between">
                            <span className="text-15">Add new vault</span>
                            <DropdownIcon className="text-neutral-40" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                {match(status)
                  .with('uninstalled', () => (
                    <PromoModal
                      open={isPromoModalOpen}
                      onClose={() => setIsPromoModalOpen(false)}
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
                      {({ show }) => (
                        // @ts-expect-error - TODO: fix this
                        <Button
                          className="w-full justify-center"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault()
                            show?.()
                          }}
                        >
                          Connect Wallet
                        </Button>
                      )}
                    </ConnectKitButton.Custom>
                  ))
                  .with('connected', () => {
                    const selectedVault = form.watch('vault')
                    const amount = form.watch('amount')
                    const hasAmount = amount !== '' && parseFloat(amount) > 0
                    const hasSelectedVault =
                      selectedVault !== '' && selectedVault !== 'new'

                    return hasSelectedVault && hasAmount ? (
                      // @ts-expect-error - TODO: fix this
                      <Button className="w-full justify-center" type="submit">
                        Stake SNT
                      </Button>
                    ) : (
                      // @ts-expect-error - TODO: fix this
                      <Button
                        className="w-full justify-center"
                        onClick={deployVault}
                      >
                        Create new vault
                      </Button>
                    )
                  })
                  .exhaustive()}
              </form>

              <div className="flex flex-col gap-[18px]">
                <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
                  <div className="mb-2 flex items-start justify-between">
                    <p className="text-13 font-500 text-neutral-60">
                      Total staked
                    </p>
                  </div>
                  <div className="mb-4 flex items-end gap-2">
                    <SNTIcon />
                    <span className="text-27 font-600">
                      {formatSNT(totalStaked ?? 0)} {TOKEN_TICKER}
                    </span>
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

                    <span className="text-27 font-600">
                      x{weightedBoost.formatted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-13 font-500 text-neutral-40">
                      {weightedBoost.hasStake
                        ? `${weightedBoost.totalStaked.toFixed(2)} ${TOKEN_TICKER} staked`
                        : 'No points are ready to compound'}
                    </p>
                    {/* @ts-expect-error - TODO: fix this */}
                    <Button variant="primary" size="40">
                      Compound
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <VaultsTable />
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
