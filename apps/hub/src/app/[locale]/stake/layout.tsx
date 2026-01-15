import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    // title: 'Stake STT, receive good Karma',
    // description:
    //   'Stake STT to increase your Karma on Status Network testnet. Unlock more gasless transactions and increase your power over the network.',
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
