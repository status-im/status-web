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
      <div className="size-64 rounded-full bg-neutral-5" />
      <div className="flex flex-col gap-4">
        <Text size={40} weight="bold">
          Your Wallet.
          <br />
          Your crypto.
        </Text>
        <Text size={15} color="$neutral-50">
          Some awesome sub copy
        </Text>
      </div>
      <div className="flex w-full max-w-[270px] flex-col gap-3">
        <Button href="/onboarding/new">New wallet</Button>
        <Button href="/onboarding/import" variant="grey">
          Import wallet
        </Button>
      </div>
      <Text size={13} color="$neutral-50">
        By continuing you agree with Status
        <br />
        <Link to="/onboarding" color="$neutral-100">
          Terms of use
        </Link>{' '}
        and{' '}
        <Link to="/onboarding" color="$neutral-100">
          Privacy policy
        </Link>
      </Text>
    </div>
  )
}
