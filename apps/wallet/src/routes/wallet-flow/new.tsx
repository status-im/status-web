import { createFileRoute } from '@tanstack/react-router'

import { CreateWalletFlow } from '@/components/onboarding/create-wallet-flow'
import { OnboardingFlowLayout } from '@/components/onboarding/flow-layout'

export const Route = createFileRoute('/wallet-flow/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <OnboardingFlowLayout>
      <CreateWalletFlow
        backHref="/portfolio/assets"
        successHref="/portfolio/assets"
        requiresPasswordCreation={false}
      />
    </OnboardingFlowLayout>
  )
}
