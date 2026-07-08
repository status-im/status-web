'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '@status-im/status-network/components'
import Image from 'next/image'
import { mainnet } from 'viem/chains'
import { usePublicClient } from 'wagmi'

import airdropData from '../../../_data/airdrop.json'

type AirdropRecord = {
  wallet: string
  snt: number
  linea: number
  ethYield: number
  gusdYieldUsd: number
  depositUsd: number
  activityMultiplier: number
  crossVaultMultiplier: number
  canReceiveOnLinea: string
  reason?: string
  totalApr: number
}

type AirdropData = {
  stats: {
    wallets: number
    yes: number
    totalSnt: number
    totalLinea: number
  }
  records: AirdropRecord[]
}

const data = airdropData as AirdropData

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/
const ENS_RE = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/

const PRICES_USD = {
  eth: 2220,
  snt: 0.0101,
  linea: 0.003628,
}

const tokenFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

const ethFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 6,
})

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatMultiplier(value: number) {
  return `${Number(value || 0).toFixed(2)}x`
}

function formatApr(value: number) {
  return `${Number(value || 0).toFixed(2)}%`
}

async function resolveENS(
  name: string,
  resolveViaRpc: (() => Promise<string | null>) | undefined
) {
  if (!resolveViaRpc) {
    throw new Error(
      `Could not resolve ENS name "${name}". Try pasting the 0x address directly.`
    )
  }

  const resolvedAddress = await resolveViaRpc()
  if (resolvedAddress && ADDRESS_RE.test(resolvedAddress)) {
    return resolvedAddress
  }

  throw new Error(
    `Could not resolve ENS name "${name}". Try pasting the 0x address directly.`
  )
}

function getAllocationValue(record: AirdropRecord) {
  const rewardValue =
    record.snt * PRICES_USD.snt + record.linea * PRICES_USD.linea
  const yieldValue = record.ethYield * PRICES_USD.eth + record.gusdYieldUsd

  return {
    rewardValue,
    yieldValue,
    totalValue: rewardValue + yieldValue,
  }
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-neutral-10 px-6 py-5 first:border-b even:border-l lg:p-8">
      <strong className="block text-27 font-700 text-neutral-100">
        {value}
      </strong>
      <span className="mt-1 block text-15 text-neutral-50">{label}</span>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="min-h-[112px] rounded-16 border border-neutral-10 bg-neutral-2.5 p-5">
      <small className="text-15 text-neutral-50">{label}</small>
      <strong className="mt-4 block break-words text-19 font-700 text-neutral-100">
        {value}
      </strong>
    </article>
  )
}

function MethodCard({
  label,
  value,
  copy,
  className,
}: {
  label: string
  value: string
  copy?: string
  className?: string
}) {
  return (
    <div
      className={`rounded-16 border border-neutral-10 bg-white-100 p-5 ${
        className ?? ''
      }`}
    >
      <small className="text-15 text-neutral-50">{label}</small>
      <strong className="mt-1 block text-27 font-700 text-purple">
        {value}
      </strong>
      {copy && (
        <span className="mt-2 block text-15 text-neutral-50">{copy}</span>
      )}
    </div>
  )
}

export default function CheckerPage() {
  const publicClient = usePublicClient({ chainId: mainnet.id })
  const [input, setInput] = useState('')
  const [status, setStatus] = useState(
    'Enter a wallet address or ENS to check the allocation.'
  )
  const [isError, setIsError] = useState(false)
  const [record, setRecord] = useState<AirdropRecord | null>(null)
  const [emptyVisible, setEmptyVisible] = useState(false)

  const records = useMemo(() => {
    return new Map(data.records.map(item => [item.wallet.toLowerCase(), item]))
  }, [])

  const values = record ? getAllocationValue(record) : null
  const ready = String(record?.canReceiveOnLinea).toLowerCase() === 'yes'

  async function lookup(value: string) {
    const normalizedInput = value.trim().toLowerCase()

    if (!normalizedInput) {
      setRecord(null)
      setEmptyVisible(false)
      setIsError(false)
      setStatus('Enter a wallet address or ENS to check the allocation.')
      return
    }

    let lookupAddress = normalizedInput
    const isEnsName = normalizedInput.includes('.')

    if (isEnsName) {
      if (!ENS_RE.test(normalizedInput)) {
        setRecord(null)
        setEmptyVisible(false)
        setIsError(true)
        setStatus('That does not look like a valid ENS name.')
        return
      }

      setRecord(null)
      setEmptyVisible(false)
      setIsError(false)
      setStatus(`Resolving ${normalizedInput}...`)

      try {
        lookupAddress = (
          await resolveENS(normalizedInput, async () => {
            if (!publicClient) return null

            const resolvedAddress = await publicClient.getEnsAddress({
              name: normalizedInput,
            })

            return resolvedAddress ?? null
          })
        ).toLowerCase()
      } catch (error) {
        setRecord(null)
        setEmptyVisible(false)
        setIsError(true)
        setStatus(
          error instanceof Error
            ? error.message
            : 'Could not resolve that ENS name.'
        )
        return
      }
    }

    if (!ADDRESS_RE.test(lookupAddress)) {
      setRecord(null)
      setEmptyVisible(false)
      setIsError(true)
      setStatus('That does not look like an Ethereum address or ENS name.')
      return
    }

    const allocation = records.get(lookupAddress)

    if (!allocation) {
      setRecord(null)
      setEmptyVisible(true)
      setIsError(true)
      setStatus(
        isEnsName
          ? `No allocation found for ${normalizedInput} (${shortAddress(
              lookupAddress
            )}).`
          : 'No allocation found for this address.'
      )
      return
    }

    setRecord(allocation)
    setEmptyVisible(false)
    setIsError(false)
    setStatus('Allocation found')

    const url = new URL(window.location.href)
    url.searchParams.set(
      'address',
      isEnsName ? normalizedInput : allocation.wallet
    )
    window.history.replaceState({}, '', url)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const address = params.get('address')

    if (address) {
      setInput(address)
      void lookup(address)
    }
    // records is stable for the static dataset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicClient])

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-10 p-4 pb-12 lg:py-14">
      <section className="flex flex-col gap-6">
        <div className="max-w-[760px]">
          <p className="mb-3 text-13 font-700 uppercase text-purple">
            Pre-deposit vaults
          </p>
          <h1 className="text-40 font-700 leading-[0.95] tracking-[-0.03em] text-neutral-100 lg:text-64">
            Rewards and yield checker
          </h1>
          <p className="mt-6 max-w-[720px] text-19 leading-[1.55] text-neutral-60">
            Enter a wallet address or ENS to see estimated LINEA + SNT rewards,
            and ETH + stablecoin yield from the Status Network pre-deposit vault
            campaign
          </p>
        </div>

        <form
          className="rounded-20 border border-neutral-10 bg-white-100 p-5 shadow-1"
          onSubmit={event => {
            event.preventDefault()
            void lookup(input)
          }}
        >
          <label
            htmlFor="checker-address"
            className="mb-3 block text-15 font-600 text-neutral-80"
          >
            Wallet address
          </label>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              id="checker-address"
              value={input}
              onChange={event => setInput(event.target.value)}
              className="min-h-14 min-w-0 rounded-12 border border-neutral-20 bg-white-100 px-4 text-15 text-neutral-100 outline-none transition focus:border-purple"
              type="text"
              spellCheck="false"
              placeholder="0x... or vitalik.eth"
              aria-describedby="checker-status"
            />
            <Button
              type="submit"
              variant="primary"
              size="40"
              className="min-h-14 px-7"
            >
              Check
            </Button>
          </div>
          <p
            id="checker-status"
            className={`mt-4 text-15 font-600 ${
              isError ? 'text-danger-50' : 'text-neutral-60'
            } ${status === 'Allocation found' ? 'text-success-50' : ''}`}
          >
            {status === 'Allocation found' ? '✅ ' : ''}
            {status}
          </p>
        </form>
      </section>

      {record && values && (
        <section className="rounded-20 border border-neutral-10 bg-white-100 p-5 shadow-1 lg:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="break-all text-13 font-700 uppercase text-purple">
                {record.wallet}
              </p>
              <h2 className="mt-2 text-27 font-700 text-neutral-100">
                Allocation breakdown
              </h2>
            </div>
            <span
              className={`self-start rounded-full px-4 py-2 text-15 font-700 ${
                ready
                  ? 'bg-success-50/10 text-success-50'
                  : 'bg-customisation-orange-50/10 text-customisation-orange-60'
              }`}
            >
              {ready ? 'Linea Mainnet' : 'Linea address not verified'}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="LINEA rewards"
              value={tokenFormatter.format(record.linea)}
            />
            <MetricCard
              label="SNT rewards"
              value={tokenFormatter.format(record.snt)}
            />
            <MetricCard
              label="ETH yield"
              value={`${ethFormatter.format(record.ethYield)} ETH`}
            />
            <MetricCard
              label="Stablecoin yield"
              value={usdFormatter.format(record.gusdYieldUsd)}
            />
          </div>

          <div className="mt-5 overflow-hidden rounded-16 border border-neutral-10">
            <div className="grid sm:grid-cols-2">
              <div className="border-neutral-10 p-5 text-center sm:border-r">
                <small className="text-15 text-neutral-50">
                  Reward value estimate
                </small>
                <strong className="mt-1 block text-19 font-700 text-neutral-100">
                  {usdFormatter.format(values.rewardValue)}
                </strong>
              </div>
              <div className="p-5 text-center">
                <small className="text-15 text-neutral-50">
                  Yield value estimate
                </small>
                <strong className="mt-1 block text-19 font-700 text-neutral-100">
                  {usdFormatter.format(values.yieldValue)}
                </strong>
              </div>
            </div>
            <div className="border-t border-neutral-10 p-5 text-center">
              <small className="text-15 text-neutral-50">
                Total allocation value estimate
              </small>
              <strong className="mt-2 block text-27 font-700 text-neutral-100">
                {usdFormatter.format(values.totalValue)}
              </strong>
            </div>
            <div className="grid border-t border-neutral-10 sm:grid-cols-2">
              <div className="border-neutral-10 p-5 text-center sm:border-r">
                <small className="text-15 text-neutral-50">
                  Activity multiplier
                </small>
                <strong className="mt-1 block text-19 font-700 text-neutral-100">
                  {formatMultiplier(record.activityMultiplier)}
                </strong>
              </div>
              <div className="p-5 text-center">
                <small className="text-15 text-neutral-50">
                  Multi-vault multiplier
                </small>
                <strong className="mt-1 block text-19 font-700 text-neutral-100">
                  {formatMultiplier(record.crossVaultMultiplier)}
                </strong>
              </div>
            </div>
            <div className="border-t border-neutral-10 p-5 text-center">
              <small className="text-15 text-neutral-50">Estimated APR</small>
              <strong className="mt-1 block text-27 font-700 text-neutral-100">
                {formatApr(record.totalApr)}
              </strong>
            </div>
          </div>

          <p className="mt-6 border-l-4 border-purple pl-4 text-15 text-neutral-70">
            {ready
              ? `Linea Mainnet eligibility: ${record.reason || 'eligible'}`
              : `Linea Mainnet status: address not verified. ${
                  record.reason ||
                  'Needs manual review before Linea distribution.'
                }`}
          </p>
        </section>
      )}

      {emptyVisible && (
        <section className="rounded-20 border border-neutral-10 bg-white-100 p-8 text-center shadow-1">
          <h2 className="text-27 font-700 text-neutral-100">
            No allocation found
          </h2>
          <p className="mt-2 text-15 text-neutral-60">
            Check the wallet address or ENS and try again.
          </p>
        </section>
      )}

      <section className="grid overflow-hidden rounded-20 border border-neutral-10 bg-white-100 sm:grid-cols-2">
        <StatCard
          value={data.stats.wallets.toLocaleString('en-US')}
          label="eligible wallets"
        />
        <StatCard
          value={data.stats.yes.toLocaleString('en-US')}
          label="ready for Linea Mainnet"
        />
        <StatCard
          value={compactFormatter.format(data.stats.totalSnt)}
          label="SNT rewards"
        />
        <StatCard
          value={compactFormatter.format(data.stats.totalLinea)}
          label="LINEA rewards"
        />
      </section>

      <section className="overflow-hidden rounded-20 bg-neutral-2.5 p-4">
        <Image
          src="/checker-character.png"
          alt=""
          width={672}
          height={960}
          className="mx-auto size-auto max-h-[420px] max-w-full object-contain lg:max-h-[560px]"
          priority
        />
      </section>

      <section id="methodology" className="flex flex-col gap-4">
        <div>
          <p className="mb-3 text-13 font-700 uppercase text-purple">
            Methodology
          </p>
          <h2 className="max-w-[760px] text-27 font-700 leading-[1.05] text-neutral-100 lg:text-40">
            Status Network pre-deposit rewards & yield
          </h2>
        </div>

        <article className="rounded-20 border border-neutral-10 bg-white-100 p-5">
          <h3 className="text-19 font-700 text-neutral-100">Token rewards</h3>
          <p className="mt-2 text-15 text-neutral-60">
            20M SNT + 20M LINEA, split by vault-specific reward pools.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MethodCard label="SNT vault" value="8M LINEA rewards" />
            <MethodCard label="LINEA vault" value="2.5M SNT rewards" />
            <MethodCard label="ETH vault" value="6M LINEA + 7M SNT rewards" />
            <MethodCard
              label="GUSD vault"
              value="6M LINEA + 10.5M SNT rewards"
            />
          </div>
          <p className="mt-5 border-l-4 border-purple pl-4 text-15 text-neutral-70">
            Your share = average daily TVL share x multiplier, then renormalized
            so the full pool is distributed.
          </p>
        </article>

        <article className="rounded-20 border border-neutral-10 bg-white-100 p-5">
          <h3 className="text-19 font-700 text-neutral-100">
            Rewards multiplier
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MethodCard
              label="Engagement"
              value="Max 3.4x"
              copy="Sepolia Karma, Hoodi balances, Karma Climber, Status Mines"
            />
            <MethodCard
              label="Cross-vault"
              value="Max 2.6x"
              copy="Bonus for depositing in 2, 3, or 4 vaults"
            />
            <MethodCard
              label="Total rewards multipliers"
              value="Max 4x"
              className="sm:col-span-2 sm:text-center"
            />
          </div>
        </article>

        <article className="rounded-20 border border-neutral-10 bg-white-100 p-5">
          <h3 className="text-19 font-700 text-neutral-100">Yield</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MethodCard
              label="ETH vault yield"
              value="16.17 ETH"
              copy="Earned via Lido staking, about 2% APR, distributed pro-rata by amount x time, no multiplier."
            />
            <MethodCard
              label="Stablecoin vault yield"
              value="$23,433"
              copy="Average weighted APR is about 4.24%, distributed pro-rata by amount x time, no multiplier, paid in stablecoins."
            />
          </div>
        </article>

        <article className="rounded-20 border border-neutral-10 bg-white-100 p-5">
          <h3 className="text-19 font-700 text-neutral-100">Eligibility</h3>
          <p className="mt-2 text-15 leading-[1.55] text-neutral-70">
            A small number of smart wallets and old multisigs need a deployable
            Linea address to receive the airdrops. Those allocations will be
            held until a valid Linea Mainnet address is created. Starting June
            9th, the remaining allocated rewards and yield will be bridged back
            to Ethereum and distributed there.
          </p>
        </article>

        <article className="rounded-20 border border-neutral-10 bg-white-100 p-5">
          <h3 className="text-19 font-700 text-neutral-100">
            ⚠️ For multisig depositors
          </h3>
          <p className="mt-4 text-15 leading-[1.55] text-neutral-70">
            If you deposited from a multisig, make sure a multisig is deployed
            at the same address on Linea Mainnet before receiving your rewards
            and yield. This keeps the allocation accessible from the same
            multisig setup you used to deposit.
          </p>
          <p className="mt-4 text-15 leading-[1.55] text-neutral-70">
            If you do not have one yet, follow{' '}
            <a
              href="https://help.safe.global/articles/9317165368-deploying-a-multi-chain-safe?lang=en"
              className="font-700 text-purple underline hover:text-purple-dark"
            >
              Safe&apos;s official multi-chain deployment guide
            </a>
            .
          </p>
        </article>
      </section>
    </div>
  )
}
