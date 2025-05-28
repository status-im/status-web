import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: RouteComponent,
  beforeLoad: () => {
    // TODO: check if user is already onboarded
    // throw redirect({ to: '/' })
  },
})

function RouteComponent() {
  return (
    <div className="h-full p-5">
      <Outlet />
    </div>
  )
}
