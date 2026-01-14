import { Metadata as MetadataFn } from '~/app/_metadata'

export const metadata = MetadataFn({
  // title: 'Pre-Deposit Vaults',
  // description:
  //   'Deposit funds into pre-deposit vaults to earn rewards in KARMA, SNT, LINEA and points. Funds will be unlocked at mainnet launch.',
  alternates: {
    canonical: '/pre-deposits',
  },
})

export default function PreDepositsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
