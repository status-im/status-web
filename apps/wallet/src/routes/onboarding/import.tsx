import { createFileRoute } from '@tanstack/react-router'

import { ImportWalletFlow } from '@/components/onboarding/import-wallet-flow'

export const Route = createFileRoute('/onboarding/import')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ImportWalletFlow
      backHref="/onboarding"
      successHref="/portfolio/assets"
      hardwareWalletHref="/onboarding/import-hardware"
    />
  )
}
