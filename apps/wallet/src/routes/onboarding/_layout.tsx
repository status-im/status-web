import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { apiClient } from '../../providers/api-client'

export const Route = createFileRoute('/onboarding')({
  component: RouteComponent,
  beforeLoad: async () => {
    const wallets = await apiClient.wallet.all.query()
    if (wallets && wallets.length > 0) {
      throw redirect({ to: '/portfolio' })
    }
  },
})

function RouteComponent() {
  return (
    <div className="m-auto min-h-[650px] w-full max-w-[440px] rounded-[24px] border border-neutral-5 p-5 shadow-2">
      <Outlet />
    </div>
  )
}
