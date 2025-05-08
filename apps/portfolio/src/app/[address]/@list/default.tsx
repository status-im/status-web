import { headers } from 'next/headers'

import BalanceDefault from './@balance/default'
import SummaryDefault from './@summary/default'
import AssetsDefault from './assets/default'
import CollectiblesDefault from './collectibles/default'
import Layout from './layout'

type Props = {
  params: Promise<{ address: string }>
  searchParams: Promise<{ networks: string }>
}

export default async function Default(props: Props) {
  const headerList = await headers()
  const pathname = headerList.get('x-current-path') || ''

  const isAssets = pathname.includes('assets')

  return (
    <Layout
      balance={<BalanceDefault {...props} />}
      summary={<SummaryDefault {...props} />}
    >
      {isAssets ? (
        <AssetsDefault {...props} />
      ) : (
        <CollectiblesDefault {...props} />
      )}
    </Layout>
  )
}
