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
    <div className="m-auto h-[650px] w-[440px] rounded-20 border border-neutral-20 p-5 shadow-2">
      <Outlet />
    </div>
  )
}
