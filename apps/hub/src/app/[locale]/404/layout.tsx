import { Metadata as MetadataFn } from '~/app/_metadata'

export const dynamic = 'force-static'

export const metadata = MetadataFn({
  // title: '404 — Page Not Found',
  // description:
  //   'The page you were looking for could not be found. Return to the Status Hub homepage.',
  robots: {
    index: false,
  },
})

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
