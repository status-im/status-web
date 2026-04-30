import { createFileRoute } from '@tanstack/react-router'

import { OnboardingFlowLayout } from '@/components/onboarding/flow-layout'
import { ImportWalletFlow } from '@/components/onboarding/import-wallet-flow'

export const Route = createFileRoute('/wallet-flow/import')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <OnboardingFlowLayout>
      <ImportWalletFlow
        backHref="/portfolio/assets"
        successHref="/portfolio/assets"
        requiresPasswordCreation={false}
      />
    </OnboardingFlowLayout>
  )
}
