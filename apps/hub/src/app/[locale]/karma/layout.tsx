import { Metadata as MetadataFn } from '~/app/_metadata'

export const metadata = MetadataFn({
  // title: 'Karma',
  // description:
  //   'Increase your Karma, unlock more free transactions, gain power over the network on Status Network.',
  alternates: {
    canonical: '/karma',
  },
})

export default function KarmaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
