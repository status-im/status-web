import { Metadata as MetadataFn } from '~/app/_metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    // title: 'Discover — Gasless apps FTW',
    // description:
    //   'Explore curated dApps and services built on Status Network. Discover gasless applications and services.',
    pathname: '/discover',
    locale,
  })
}

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
