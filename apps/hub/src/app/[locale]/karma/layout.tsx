import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    title: 'Status Network | Reputation Governance on Ethereum L2',
    description:
      "Karma is Status Network's non-transferable reputation system for governance, incentives, and access on a gasless, privacy-enabled Ethereum L2.",
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
