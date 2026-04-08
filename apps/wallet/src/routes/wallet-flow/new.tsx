import { createFileRoute } from '@tanstack/react-router'

import { CreateWalletFlow } from '@/components/onboarding/create-wallet-flow'

export const Route = createFileRoute('/wallet-flow/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <CreateWalletFlow
      backHref="/portfolio/assets"
      successHref="/portfolio/assets"
      requiresPasswordCreation={false}
    />
  )
}
