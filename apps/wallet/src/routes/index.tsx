import { createFileRoute, redirect } from '@tanstack/react-router'

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
})

function RouteComponent() {
  return <>Index</>
}
