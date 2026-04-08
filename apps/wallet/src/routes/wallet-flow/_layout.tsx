import { createFileRoute, Outlet } from '@tanstack/react-router'

import { OnboardingFlowLayout } from '@/components/onboarding/flow-layout'

export const Route = createFileRoute('/wallet-flow')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <OnboardingFlowLayout>
      <Outlet />
    </OnboardingFlowLayout>
  )
}
