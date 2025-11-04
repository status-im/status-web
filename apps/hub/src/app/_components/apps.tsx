import { ExternalIcon } from '@status-im/icons/20'
import { TwitterIcon } from '@status-im/icons/social'
import { ButtonLink } from '@status-im/status-network/components'
import {
  CATS_FISHING_URL,
  STATUS_NETWORK_BRIDGE_URL,
} from '@status-im/status-network/config'
import { cx } from 'cva'
import Image from 'next/image'

const Apps = () => {
  return (
    <section className="rounded-32 bg-neutral-2.5 p-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="max-w-2xl">
          <h3 className="mb-2 text-27 font-600 text-neutral-90">
            Explore apps
          </h3>

          <p className="ml-1 text-15 text-neutral-60">
            Explore curated Apps and services built on Status Network
          </p>
        </div>
        <ButtonLink href="/discover" variant="outline" size="32">
          Explore all apps
        </ButtonLink>
      </div>
      <div className="mb-24 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <GameCard
          title="Cats Fishing"
          description="You love cats, cats love fish."
          image="/apps/cats-fishing-cover.png"
          website={CATS_FISHING_URL}
          twitter="catsfishings"
          icon="/apps/cats-fishing-avatar.png"
        />
        <GameCard
          title="Status Network Bridge"
          description="Saving for gas? We’ve got you covered!"
          image="/apps/status-network-bridge-cover.png"
          website={STATUS_NETWORK_BRIDGE_URL}
          twitter="StatusL2"
          icon="/apps/status-network-bridge-avatar.png"
        />
      </div>
    </section>
  )
}

export { Apps }

type CardProps = {
  children: React.ReactNode
  className?: string
}

const Card = (props: CardProps) => {
  const { children, className } = props

  return (
    <div
      className={cx([
        'rounded-32 border border-neutral-10 bg-white-100 shadow-1 transition-all hover:scale-[101%] hover:shadow-2 lg:rounded-20',
        className,
      ])}
    >
      {children}
    </div>
  )
}

const CardHeader = (props: CardProps) => {
  const { children, className } = props

  return (
    <div
      className={cx(['overflow-hidden rounded-24 lg:rounded-t-16', className])}
    >
      {children}
    </div>
  )
}

const CardContent = (props: CardProps) => {
  const { children, className } = props

  return <div className={className}>{children}</div>
}

type GameCardProps = {
  title: string
  description: string
  image: string
  website: string
  twitter: string
  icon?: string
}

const GameCard = (props: GameCardProps) => {
  const { title, description, image, website, twitter, icon } = props

  return (
    <Card className="flex flex-col overflow-hidden rounded-28 p-2">
      <CardHeader className="relative h-[110px] flex-shrink-0 rounded-20 lg:h-[137px]">
        <Image src={image} alt={title} fill className="object-cover" />
      </CardHeader>
      <CardContent className="relative z-10 flex flex-grow flex-col gap-4 p-4">
        <div className="-mt-20 flex flex-col items-start gap-3">
          {icon && (
            <Image
              src={icon}
              alt={`${title} icon`}
              width={80}
              height={80}
              quality={100}
              className="size-20 rounded-16 object-cover"
            />
          )}
          <div>
            <h3 className="text-19 font-600">{title}</h3>
            <p className="">{description}</p>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-3">
          <ButtonLink
            href={website}
            variant="white"
            size="32"
            icon={<ExternalIcon className="text-neutral-50" />}
          >
            <span>{website.replace('https://', '')}</span>
          </ButtonLink>
          <ButtonLink
            href={`https://x.com/${twitter}`}
            variant="white"
            size="32"
            className="w-8 px-[7px]"
          >
            <TwitterIcon className="size-4" />
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  )
}

export { GameCard }
