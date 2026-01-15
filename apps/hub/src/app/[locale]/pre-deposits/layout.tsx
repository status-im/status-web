import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    // title: 'Pre-Deposit Vaults',
    // description:
    //   'Deposit funds into pre-deposit vaults to earn rewards in KARMA, SNT, LINEA and points. Funds will be unlocked at mainnet launch.',
    pathname: '/pre-deposits',
    locale,
  })
}

export default function PreDepositsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
