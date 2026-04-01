import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    title: 'Status Network | Public Funding Pool',
    description:
      'A transparent pool that powers ongoing development and ecosystem initiatives on Status Network.',
    pathname: '/funding-pool',
    locale,
  })
}

export default function FundingPoolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
