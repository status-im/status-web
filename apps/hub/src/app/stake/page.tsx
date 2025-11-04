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
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useBalance, useConfig, useReadContract } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'

import { HubLayout } from '~components/hub-layout'
import { LaunchIcon, SNTIcon } from '~components/icons'
import { PromoModal } from '~components/stake/promo-modal'
import { VaultSelect } from '~components/vault-select'
import { VaultsTable } from '~components/vaults/vaults-table'
import {
  DEFAULT_MP_VALUE,
  MAX_BOOST,
  SNT_TOKEN,
  STAKE_PAGE_CONSTANTS,
  STAKING_MANAGER,
  TIME_CONSTANTS,
  TOOLTIP_CONFIG,
} from '~constants/index'
import { useApproveToken } from '~hooks/useApproveToken'
import { useCompoundMultiplierPoints } from '~hooks/useCompoundMultiplierPoints'
import { useCreateVault } from '~hooks/useCreateVault'
import { useExchangeRate } from '~hooks/useExchangeRate'
import { useFaucetMutation, useFaucetQuery } from '~hooks/useFaucet'
import { useMultiplierPointsBalance } from '~hooks/useMultiplierPoints'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useVaultStateContext } from '~hooks/useVaultStateContext'
import { useVaultTokenStake } from '~hooks/useVaultTokenStake'
import { useWeightedBoost } from '~hooks/useWeightedBoost'
import { formatCurrency, formatSNT } from '~utils/currency'

import type { Address } from 'viem'

const createStakeFormSchema = () => {
  return z.object({
    amount: z.string(),
    vault: z.string(),
  })
}

type FormValues = z.infer<ReturnType<typeof createStakeFormSchema>>

type ConnectionStatus = 'uninstalled' | 'disconnected' | 'connected'

export default function StakePage() {
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false)

  const { isConnected, address } = useAccount()
  const config = useConfig()
  const { mutate: compoundMultiplierPoints } = useCompoundMultiplierPoints()
  const { data: multiplierPointsData } = useMultiplierPointsBalance()

  const { mutate: claimTokens, isPending: isClaimingTokens } =
    useFaucetMutation()
  const { data: faucetData } = useFaucetQuery()
  const { data: vaults, refetch: refetchStakingVaults } = useStakingVaults()
  const weightedBoost = useWeightedBoost(vaults)
  const { data: exchangeRate } = useExchangeRate()

  const form = useForm<FormValues>({
    resolver: zodResolver(createStakeFormSchema()),
    mode: 'onChange',
    defaultValues: {
      amount: '',
      vault: '',
    },
  })

  const { data: balance } = useBalance({
    scopeKey: 'balance',
    address,
    token: SNT_TOKEN.address,
    query: {
      enabled: isConnected,
    },
  })

  const { data: totalStaked } = useReadContract({
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'totalStaked',
  }) as { data: bigint }

  const { mutate: createVault } = useCreateVault()
  const { mutate: approveToken } = useApproveToken()
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

  const {
    isDisabled: isDisabledMultiplierPoints,
    message: messageMultiplierPoints,
  } = useMemo(() => {
    const totalUncompounded =
      multiplierPointsData?.totalUncompounded ?? DEFAULT_MP_VALUE
    const hasUncompoundedPoints = totalUncompounded >= DEFAULT_MP_VALUE
    const formattedAmount = formatSNT(
      formatUnits(totalUncompounded, SNT_TOKEN.decimals),
      {
        decimals: SNT_TOKEN.decimals,
      }
    )

    return {
      isDisabled: !hasUncompoundedPoints || !isConnected,
      message: hasUncompoundedPoints
        ? `${formattedAmount} points are ready to compound`
        : 'No points are ready to compound',
    }
  }, [multiplierPointsData, isConnected])

  const hasReachedDailyLimit = useMemo(() => {
    if (!faucetData) return false

    const currentTimestamp = BigInt(
      Math.floor(Date.now() / TIME_CONSTANTS.MILLISECONDS_PER_SECOND)
    )
    const isWithinResetWindow = faucetData.accountResetTime > currentTimestamp
    const hasExceededLimit =
      faucetData.accountDailyRequests >= faucetData.dailyLimit

    return hasExceededLimit && isWithinResetWindow
  }, [faucetData])

  const handleSubmit = async (data: FormValues) => {
    if (!data.amount || !data.vault || !address) return

    try {
      const amountWei = parseUnits(data.amount, SNT_TOKEN.decimals)

      // Check current allowance
      const currentAllowance = (await readContract(config, {
        address: SNT_TOKEN.address,
        abi: SNT_TOKEN.abi,
        functionName: 'allowance',
        args: [address, data.vault as Address],
      })) as bigint

      // Transition to increase allowance if not enough allowance
      if (amountWei >= currentAllowance) {
        approveToken(
          {
            amount: data.amount,
            spenderAddress: data.vault as Address,
          },
          {
            onSuccess: () => {
              // After approval completes, proceed to staking
              stakeVault({
                amountWei,
                lockPeriod: STAKE_PAGE_CONSTANTS.DEFAULT_STAKE_LOCK_PERIOD,
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
          lockPeriod: STAKE_PAGE_CONSTANTS.DEFAULT_STAKE_LOCK_PERIOD,
          vaultAddress: data.vault as Address,
        })
      }
    } catch {
      sendVaultEvent({ type: 'REJECT' })
    } finally {
      form.reset()
      refetchStakingVaults()
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

              <Button
                className="self-end"
                disabled={
                  !isConnected || hasReachedDailyLimit || isClaimingTokens
                }
                onClick={() =>
                  claimTokens({
                    amount: faucetData?.remainingAmount,
                  })
                }
              >
                <PlaceholderIcon className="text-blur-white/70" />
                {isClaimingTokens ? 'Claiming...' : 'Claim testnet SNT'}
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
                              className="h-[38px] w-full border-none bg-transparent text-27 font-semibold text-neutral-100 outline-none placeholder:text-neutral-40"
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
                              {`MAX ${formatSNT(balance?.value ?? 0)} SNT`}
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
                      <Button className="w-full justify-center" type="submit">
                        Stake SNT
                      </Button>
                    ) : (
                      <Button
                        className="w-full justify-center"
                        onClick={() => createVault()}
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
                      {formatSNT(totalStaked ?? 0, {
                        includeSymbol: true,
                      })}
                    </span>
                  </div>
                  <p className="text-13 font-500 text-neutral-40">
                    Next unlock in {STAKE_PAGE_CONSTANTS.NEXT_UNLOCK_DAYS} days
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
                      {weightedBoost.formatted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-13 font-500 text-neutral-40">
                      {messageMultiplierPoints}
                    </span>
                    <Button
                      disabled={isDisabledMultiplierPoints}
                      variant="primary"
                      size="40"
                      onClick={() => compoundMultiplierPoints()}
                    >
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
    delayDuration={TOOLTIP_CONFIG.DELAY_DURATION}
    side="top"
    className="border-0"
    content={
      <div className="flex w-[286px] flex-col gap-4 rounded-8 bg-white-100 p-4">
        <span className="text-13 text-neutral-100">
          The longer SNT is staked or locked in vaults, the higher this
          multiplier goes. This rewards long term believers. The maximum
          multiplier is x{MAX_BOOST}.
        </span>

        <ButtonLink
          href="https://status.app/"
          variant="outline"
          className="rounded-8 px-2 py-1"
          size="32"
          icon={<ExternalIcon className="size-3 text-neutral-50" />}
        >
          Learn more
        </ButtonLink>
      </div>
    }
  >
    <InfoIcon className="text-neutral-40" />
  </Tooltip>
)
