import { DynamicLayout } from '../../_components/dynamic-layout'
import { DevicesList } from './_components/devices-list'

export default function DevicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DynamicLayout leftView={<DevicesList />} rightView={children} />
}
