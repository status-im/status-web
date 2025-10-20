import { DynamicLayout } from '../../_components/dynamic-layout'
import { FirmwaresList } from './_components/firmwares-list'

export default function FirmwaresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DynamicLayout leftView={<FirmwaresList />} rightView={children} />
}
