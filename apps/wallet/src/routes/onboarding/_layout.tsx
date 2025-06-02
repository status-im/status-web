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
    <div className="m-auto h-[650px] w-full max-w-[440px] rounded-[24px] border border-neutral-5 p-5 shadow-2">
      <Outlet />
    </div>
  )
}
