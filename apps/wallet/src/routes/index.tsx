import { createFileRoute, redirect } from '@tanstack/react-router'

import { apiClient } from '../providers/api-client'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: () => {
    redirect({
      to: '/portfolio/assets',
      throw: true,
    })
  },
  head: () => ({
    meta: [
      {
        title: 'Extension | Wallet | Index',
      },
    ],
  }),
  beforeLoad: async () => {
    const wallets = await apiClient.wallet.all.query()
    if (wallets && wallets.length > 0) {
      throw redirect({ to: '/portfolio' })
    } else throw redirect({ to: '/onboarding' })
  },
})

function RouteComponent() {
  return <>Index</>
}
