import { Metadata as MetadataFn } from '../_metadata'

export const metadata = MetadataFn({
  // title: 'Stake STT, receive good Karma',
  // description:
  //   'Stake STT to increase your Karma on Status Network testnet. Unlock more gasless transactions and increase your power over the network.',
  alternates: {
    canonical: '/stake',
  },
})

export default function StakeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
