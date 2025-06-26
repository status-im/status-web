import { Button, Text } from '@status-im/components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center gap-6 py-3 text-center">
      <img
        src="/images/onboarding.png"
        alt="Onboarding"
        className="size-[264px]"
      />
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
        <a
          href="https://github.com/status-im/status-software-legal-documents/blob/master/terms-of-use.md"
          className="text-neutral-100"
          target="_blank"
          rel="noopenernoreferrer"
        >
          Terms of use
        </a>{' '}
        and{' '}
        <a
          href="https://github.com/status-im/status-software-legal-documents/blob/master/privacy-policy.md"
          className="text-neutral-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy policy
        </a>
      </Text>
    </div>
  )
}
