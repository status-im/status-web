import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    title: 'Status Network | Deposit Crypto & Earn Yield',
    description:
      'Deposit crypto on Status Network to earn yield, support liquidity, and prepare for staking and app usage on a gasless, privacy-enabled Ethereum L2.',
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
