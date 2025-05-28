import { Button, Text } from '@status-im/components'
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
    <div className="flex flex-col items-center gap-6 py-3 text-center">
      <div className="size-52 rounded-full bg-neutral-5" />
      <div className="flex flex-col gap-4">
        <Text size={40} weight="bold">
          Your Wallet.
          <br />
          Your crypto.
        </Text>
        <Text size={15} className="text-neutral-50">
          Some awesome sub copy
        </Text>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Button href="/onboarding/new" className="w-full">
          New wallet
        </Button>
        <Button href="/onboarding/import" className="w-full" variant="grey">
          Import wallet
        </Button>
      </div>
      <Text size={13} className="text-neutral-50">
        By continuing you agree with Status
        <br />
        <Link to="/onboarding" className="text-neutral-100">
          Terms of use
        </Link>{' '}
        and{' '}
        <Link to="/onboarding" className="text-neutral-100">
          Privacy policy
        </Link>
      </Text>
    </div>
  )
}
