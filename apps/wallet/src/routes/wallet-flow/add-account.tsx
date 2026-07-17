import { createFileRoute } from '@tanstack/react-router'

import { AddAccountFlow } from '@/components/onboarding/add-account-flow'
import { OnboardingFlowLayout } from '@/components/onboarding/flow-layout'

export const Route = createFileRoute('/wallet-flow/add-account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <OnboardingFlowLayout>
      <AddAccountFlow
        backHref="/portfolio/assets"
        successHref="/portfolio/assets"
      />
    </OnboardingFlowLayout>
  )
}
