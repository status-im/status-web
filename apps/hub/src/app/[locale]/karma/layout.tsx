import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    // title: 'Karma',
    // description:
    //   'Increase your Karma, unlock more free transactions, gain power over the network on Status Network.',
    pathname: '/karma',
    locale,
  })
}

export default function KarmaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
