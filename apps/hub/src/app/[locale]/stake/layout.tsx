import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    title: 'Status Network | Stake Crypto on Ethereum L2',
    description:
      'Stake crypto on Status Network to earn yield while supporting a gasless Ethereum Layer 2 with a native privacy layer and sustainable incentives.',
    pathname: '/stake',
    locale,
  })
}

export default function StakeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
