import { getAPIClient } from '../../../../data/api'
import { AssetsTable } from './_components/assets-table'

import type { NetworkType } from '@status-im/wallet/data'

// export const experimental_ppr = true

type Props = {
  params: Promise<{
    address: string
  }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function AssetsList(props: Props) {
  const address = (await props.params).address

  const searchParams = await props.searchParams
  const networks = searchParams['networks']?.split(',') ?? ['ethereum']

  const apiClient = await getAPIClient()

  const all = await apiClient.assets.all({
    address: address,
    networks: networks as NetworkType[],
  })

  return <AssetsTable assets={all.assets} />
}
