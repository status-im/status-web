import { DynamicLayout } from '../../_components/dynamic-layout'
import { DatabasesList } from './_components/databases-list'

export default function DatabasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DynamicLayout leftView={<DatabasesList />} rightView={children} />
}
