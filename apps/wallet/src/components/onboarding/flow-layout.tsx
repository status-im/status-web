import { BlurredCircle } from '@status-im/wallet/components'

type Props = {
  children: React.ReactNode
}

export function OnboardingFlowLayout({ children }: Props) {
  return (
    // h-full (fills the shell's calc(100vh-60px) content area, not the whole
    // viewport) + overflow-y-auto makes this the scroll container; the inner
    // min-h-full wrapper centers the card when it fits and grows (so the card
    // stays fully reachable) when its content is taller than the viewport —
    // e.g. a 24-word recovery phrase on a short window.
    <div className="relative h-full overflow-y-auto bg-neutral-5">
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

      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div className="flex min-h-[650px] w-full max-w-[440px] flex-col rounded-[24px] border border-neutral-5 bg-white-100 p-5 shadow-2">
          {children}
        </div>
      </div>
    </div>
  )
}
