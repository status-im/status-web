import { createFileRoute } from '@tanstack/react-router'

import { OnboardingFlowLayout } from '@/components/onboarding/flow-layout'
import { ImportHardwareWalletFlow } from '@/components/onboarding/import-hardware-wallet-flow'

export const Route = createFileRoute('/wallet-flow/import-hardware')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <OnboardingFlowLayout>
      <ImportHardwareWalletFlow
        backHref="/portfolio/assets"
        successHref="/portfolio/assets"
      />
    </OnboardingFlowLayout>
  )
}
