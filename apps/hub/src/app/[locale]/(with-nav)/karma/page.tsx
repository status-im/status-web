import { Metadata as MetadataFn } from '~/app/_metadata'
import { redirect } from '~/i18n/navigation'

type Props = {
  params: Promise<{ locale: string }>
}

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

export default async function KarmaPage({ params }: Props) {
  const { locale } = await params
  redirect({ href: '/', locale })
}
