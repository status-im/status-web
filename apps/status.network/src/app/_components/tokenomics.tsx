import { InfoIcon } from '@status-im/icons/20'
import { Divider } from './divider'
import { LevitatingGirl } from './levitating-girl'

const STEPS = [
  { number: '1', text: 'Ship code' },
  { number: '2', text: 'Get traction' },
  { number: '3', text: 'Receive Karma' },
  { number: '🎉', text: 'Earn funding' },
]

const Tokenomics = () => {
  return (
    <section className="w-full" id="tokenomics">
      <div className="relative px-4 pb-[290px] pt-20 lg:px-[120px] lg:py-40">
        <div className="space-y-20">
          <div className="space-y-5">
            <p className="mb-3 inline-block text-13 font-500 text-purple">
              05{' '}
              <span className="inline-block h-2 w-px bg-purple-transparent" />{' '}
              TOKENOMICS
            </p>
            <h2 className="max-w-[936px] text-40 font-600 lg:text-64">
              Earn voting power through
              <br />
              positive network engagement
            </h2>
            <p className="max-w-[746px] text-27">
              The more you contribute to the network, the more influence you
              gain over funding allocation and the network&apos;s roadmap
              priorities.
            </p>
            <p className="mt-4 flex items-center gap-1 text-19 text-neutral-50">
              <InfoIcon className="shrink-0 text-neutral-50" /> This is
              coordinated by Karma, a non-transferable governance token.
            </p>
          </div>

          <div className="space-y-2">
            <RoleCard title="App developer" description="" steps={STEPS} />
            <RoleCard
              title="Liquidity provider"
              description="Earn Karma for staking SNT and get LP rewards boosted by native yield."
            />
            <RoleCard
              title="Onchain user"
              description="Get rewarded with Karma for bridging to the network and using apps. A higher Karma means more gasless transactions."
            />
          </div>
        </div>

        <LevitatingGirl />
      </div>
      <Divider />
    </section>
  )
}

export { Tokenomics }

type RoleCardProps = {
  title: string
  description: string
  steps?: { number: string | number; text: string }[]
}

const RoleCard = (props: RoleCardProps) => {
  const { title, description, steps } = props

  return (
    <div className="rounded-32 border border-neutral-80/5 bg-[#1B273D05]">
      <div className="space-y-6 p-4 lg:p-6 lg:pt-5">
        <div className="space-y-2">
          <h3 className="text-27 font-600 lg:text-40">{title}</h3>
          <p className="text-19">{description}</p>
        </div>
        {steps && (
          <div className="2xl::grid-cols-4 grid grid-cols-1 gap-2 sm:grid-cols-2 2xl:grid-cols-4">
            {steps.map(step => (
              <Step key={step.number} number={step.number} text={step.text} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type StepProps = {
  number: string | number
  text: string
}

const Step = (props: StepProps) => {
  const { number, text } = props

  return (
    <div className="flex flex-1 items-center gap-2 rounded-16 border border-neutral-80/10 bg-white-80 p-2 pr-3">
      <span className="flex size-8 items-center justify-center rounded-10 bg-neutral-80/5 text-19 font-600">
        {number}
      </span>
      <span className="text-19 font-600 lg:text-27">{text}</span>
    </div>
  )
}
