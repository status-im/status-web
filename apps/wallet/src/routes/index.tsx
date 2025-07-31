import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: () => {
    redirect({
      to: '/portfolio/tokens',
      throw: true,
    })
  },
})

function RouteComponent() {
  return <>index</>
}
