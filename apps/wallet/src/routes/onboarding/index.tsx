import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Extension | Wallet | Onboarding',
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="grid gap-2">
      <Link
        to="/onboarding/new"
        className="flex h-10 items-center rounded-12 bg-neutral-50 px-3 text-15 font-medium transition-colors active:bg-neutral-50 hover:bg-neutral-90"
      >
        Create a wallet
      </Link>
      <Link
        to="/onboarding/import"
        className="flex h-10 items-center rounded-12 bg-neutral-50 px-3 text-15 font-medium transition-colors active:bg-neutral-50 hover:bg-neutral-90"
      >
        I already have a wallet
      </Link>
    </div>
  )
}
