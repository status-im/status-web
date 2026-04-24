import { createFileRoute } from '@tanstack/react-router'

import { ImportHardwareWalletFlow } from '../../components/onboarding/import-hardware-wallet-flow'

export const Route = createFileRoute('/onboarding/import-hardware')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ImportHardwareWalletFlow
      backHref="/onboarding"
      successHref="/portfolio/assets"
    />
  )
}
