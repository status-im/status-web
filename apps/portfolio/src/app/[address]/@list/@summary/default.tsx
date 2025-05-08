import { Address } from 'src/app/_components/address'

import { api } from '../../../../data/api'

import type { NetworkType } from '@status-im/wallet/data'

type Props = {
  params: Promise<{
    address: string
  }>
  searchParams: Promise<{
    networks: string
  }>
}

export default async function Summary({ params, searchParams }: Props) {
  const address = (await params).address
  const networks = (await searchParams)['networks']?.split(',') ?? [
    'ethereum',
    'optimism',
    'arbitrum',
    'base',
    'polygon',
    'bsc',
  ]

  const { summary } = await api.assets.all({
    address,
    networks: networks as NetworkType[],
  })

  return (
    <Address
      variant="balance"
      balance={summary.total_eur}
      showOptions={false}
    />
  )
}
