import { Metadata as MetadataFn } from '~/app/_metadata'

export const metadata = MetadataFn({
  // title: 'Discover — Gasless apps FTW',
  // description:
  //   'Explore curated dApps and services built on Status Network. Discover gasless applications and services.',
  pathname: '/discover',
  alternates: {
    canonical: '/discover',
  },
})

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
