import { Metadata as MetadataFn } from '../_metadata'

export const metadata = MetadataFn({
  // title: 'Dashboard',
  // description:
  // 'Manage your Status Network assets, discover applications, and navigate to various services. Deposit funds for yield and rewards.',
  alternates: {
    canonical: '/dashboard',
  },
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
