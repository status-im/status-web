import { getAPIClient } from '../../../../data/api'
import { Balance } from '../../../_components/balance'

import type { NetworkType } from '@status-im/wallet/data'

type Props = {
  params: Promise<{
    address: string
  }>
  searchParams: Promise<{
    networks: string
  }>
}

export default async function TotalBalance({ params, searchParams }: Props) {
  const address = (await params).address
  const networks = (await searchParams)['networks']?.split(',') ?? [
    'ethereum',
    'optimism',
    'arbitrum',
    'base',
    'polygon',
    'bsc',
  ]

  const apiClient = await getAPIClient()

  const { summary } = await apiClient.assets.all({
    address,
    networks: networks as NetworkType[],
  })

  return <Balance summary={summary} />
}
