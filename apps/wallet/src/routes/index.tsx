import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
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
