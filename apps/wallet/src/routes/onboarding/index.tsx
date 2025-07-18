import { Button, Text } from '@status-im/components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center gap-6 pb-3 text-center">
      <img
        src="/images/intro.png"
        alt="Onboarding"
        className="mt-[-20px] h-[322px] w-full min-w-[440px]"
      />
      <div className="flex flex-col gap-4">
        <Text size={40} weight="bold">
          Your Wallet.
          <br />
          Your Game.
        </Text>
        <Text size={15} color="$neutral-50">
          Track portfolio to stay ahead - own your edge
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
          href="https://github.com/status-im/status-software-legal-documents/blob/master/browser-extension-wallet-terms-of-use.md"
          className="text-neutral-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of use
        </a>{' '}
        and{' '}
        <a
          href="https://github.com/status-im/status-software-legal-documents/blob/master/browser-extension-wallet-privacy-policy.md"
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
