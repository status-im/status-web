import { createFileRoute } from '@tanstack/react-router'

import { CreateWalletFlow } from '@/components/onboarding/create-wallet-flow'

export const Route = createFileRoute('/onboarding/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <CreateWalletFlow backHref="/onboarding" successHref="/portfolio/assets" />
  )
}
