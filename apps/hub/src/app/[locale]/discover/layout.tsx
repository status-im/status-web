import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    title: 'Status Network | Discover dApps on Ethereum L2',
    description:
      'Discover dApps built on Status Network, a gasless Ethereum Layer 2 where users can interact with wallets, DeFi, and apps privately by default.',
    pathname: '/discover',
    locale,
  })
}

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
