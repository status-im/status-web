'use client'

import { useMemo } from 'react'

import { ExternalIcon } from '@status-im/icons/20'
import { ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { DonutChart } from '~components/funding-pool'
import { HubLayout } from '~components/hub-layout'

import type { Segment } from '~components/funding-pool'

const CONTRACT_ADDRESS = '0xE2d622C817878dA5143bBE06866ca8E35273Ba8'
const CHART_COLORS = ['#FFA22D', '#D37EF4', '#7140FD', '#2CA9A0']

type BreakdownSource = {
  key: string
  label: string
  description: string
  linkText: string
  linkHref: string
  amount: number
  color: string
}

function useFundingPoolData(t: ReturnType<typeof useTranslations>) {
  return useMemo(() => {
    const rawSources = [
      {
        key: 'native_apps',
        label: t('funding_pool.native_apps'),
        description: t('funding_pool.native_apps_description'),
        linkText: t('funding_pool.native_apps_link'),
        linkHref: '#',
        amount: 1345,
      },
      {
        key: 'donations',
        label: t('funding_pool.donations'),
        description: t('funding_pool.donations_description'),
        linkText: t('funding_pool.donations_link'),
        linkHref: '#',
        amount: 835,
      },
      {
        key: 'transaction_fees',
        label: t('funding_pool.transaction_fees'),
        description: t('funding_pool.transaction_fees_description'),
        linkText: t('funding_pool.transaction_fees_link'),
        linkHref: '#',
        amount: 1875,
      },
      {
        key: 'yield_bearing_bridge',
        label: t('funding_pool.yield_bearing_bridge'),
        description: t('funding_pool.yield_bearing_bridge_description'),
        linkText: t('funding_pool.yield_bearing_bridge_link'),
        linkHref: '#',
        amount: 452,
      },
    ]

    const sources: BreakdownSource[] = rawSources.map((s, i) => ({
      ...s,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))

    const totalEth = sources.reduce((sum, s) => sum + s.amount, 0)
    const ethPrice = 3000
    const totalUsd = totalEth * ethPrice

    return { sources, totalEth, totalUsd }
  }, [t])
}

function TotalAmountCard({
  totalEth,
  totalUsd,
  t,
}: {
  totalEth: number
  totalUsd: number
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="flex w-full max-w-[1020px] flex-col gap-4 rounded-32 border border-neutral-10 bg-white-100 p-4 shadow-1 sm:p-8 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-13 font-medium text-neutral-50">
          {t('funding_pool.total_amount')}
        </span>
        <div className="flex items-start gap-2">
          <div className="relative mt-0.5 size-8 shrink-0">
            <Image
              src="/tokens/eth.png"
              alt="ETH"
              width={64}
              height={64}
              quality={100}
            />
            <Image
              src="/networks/status-network.png"
              alt="Status Network"
              width={24}
              height={24}
              className="absolute -bottom-0.5 -right-1 size-3 rounded-full border border-white-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-19 font-semibold text-neutral-100 sm:text-27">
              {totalEth.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {'  ETH'}
            </span>
            <span className="text-15 font-semibold text-neutral-50 sm:text-19">
              $
              {totalUsd.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>

      <ButtonLink
        href="#"
        variant="primary"
        size="40"
        icon={<ExternalIcon className="text-white-80" />}
      >
        {t('funding_pool.vote_for_allocation')}
      </ButtonLink>
    </div>
  )
}

function BreakdownCard({
  sources,
  t,
}: {
  sources: BreakdownSource[]
  t: ReturnType<typeof useTranslations>
}) {
  const segments: Segment[] = sources.map(s => ({
    label: s.label,
    value: s.amount,
    color: s.color,
  }))

  return (
    <div className="flex w-full max-w-[1020px] flex-col gap-2 rounded-32 border border-neutral-10 bg-white-100 p-4 pb-10 shadow-1 sm:px-8 sm:pb-14 sm:pt-8">
      <span className="text-13 font-medium text-neutral-50">
        {t('funding_pool.breakdown')}
      </span>

      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full max-w-[280px] shrink-0 pt-6">
          <DonutChart segments={segments} />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-8 lg:w-[588px] lg:shrink">
          {sources.map(source => (
            <div key={source.key} className="flex gap-4">
              <div
                className="mt-1 size-5 shrink-0 rounded-full"
                style={{ backgroundColor: source.color }}
              />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-19 font-500 text-neutral-100">
                    {source.label}
                  </span>
                  <span className="text-15 font-semibold text-neutral-50">
                    {source.amount.toLocaleString('en-US')} ETH
                  </span>
                </div>
                <div className="flex flex-col text-15 font-medium">
                  <p className="text-neutral-50">{source.description}</p>
                  <a
                    href={source.linkHref}
                    className="text-purple hover:underline"
                  >
                    {source.linkText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SmartContractCard({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex w-full max-w-[1020px] flex-col gap-4 rounded-32 border border-neutral-10 bg-white-100 p-4 shadow-1 sm:p-8 md:flex-row md:items-end md:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-13 font-medium text-neutral-50">
          {t('funding_pool.smart_contract')}
        </span>
        <span className="truncate text-15 font-semibold text-neutral-100 sm:text-19 lg:text-27">
          {CONTRACT_ADDRESS}
        </span>
      </div>

      <ButtonLink
        href="#"
        variant="primary"
        size="40"
        className="shrink-0"
        icon={<ExternalIcon className="text-white-80" />}
      >
        {t('funding_pool.view_on_explorer')}
      </ButtonLink>
    </div>
  )
}

export default function FundingPoolPage() {
  const t = useTranslations()
  const { sources, totalEth, totalUsd } = useFundingPoolData(t)

  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-8 p-4 pt-8 lg:pl-0 lg:pr-6 lg:pt-14">
        <div className="flex flex-col gap-2">
          <h1 className="text-27 font-semibold text-neutral-100 lg:text-40">
            {t('funding_pool.title')}
          </h1>
          <p className="text-13 font-500 text-neutral-100 lg:text-19">
            {t('funding_pool.description')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 rounded-8 py-8 lg:bg-neutral-2.5">
          <TotalAmountCard totalEth={totalEth} totalUsd={totalUsd} t={t} />
          <BreakdownCard sources={sources} t={t} />
          <SmartContractCard t={t} />
        </div>
      </div>
    </HubLayout>
  )
}
