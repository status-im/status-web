import { BlurredCircle } from '@status-im/wallet/components'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative flex h-screen min-h-[650px] bg-neutral-5">
      <BlurredCircle
        color="purple"
        className="absolute left-1/4 top-1/4 z-0 translate-y-[-100px]"
      />
      <BlurredCircle
        color="sky"
        className="absolute left-2/4 top-1/4 z-0 translate-y-[-130px]"
      />
      <BlurredCircle
        color="yellow"
        className="absolute left-1/4 top-2/4 z-0 translate-y-[-50px]"
      />
      <BlurredCircle
        color="orange"
        className="absolute left-2/4 top-2/4 z-0 translate-y-[-80px]"
      />

      <div className="relative z-10 m-auto flex min-h-[650px] w-full max-w-[440px] flex-col rounded-[24px] border border-neutral-5 bg-white-100 p-5 shadow-2">
        <Outlet />
      </div>
    </div>
  )
}
