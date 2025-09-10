import { ExternalIcon } from '@status-im/icons/20'
import { TwitterIcon } from '@status-im/icons/social'
import { cx } from 'cva'
import Image from 'next/image'

import { ButtonLink } from '../button-link'

type CardProps = {
  children: React.ReactNode
  className?: string
}

const Card = (
  props: CardProps & {
    hasShadow: boolean
  },
) => {
  const { children, className, hasShadow } = props

  return (
    <div
      className={cx([
        'rounded-32 border border-neutral-10 bg-white-100 transition-all hover:scale-[101%] lg:rounded-20',
        className,
        hasShadow ? 'shadow-1 hover:shadow-2' : '',
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
  hasShadow?: boolean
}

const GameCard = (props: GameCardProps) => {
  const {
    title,
    description,
    image,
    website,
    twitter,
    icon,
    hasShadow = true,
  } = props

  return (
    <Card
      className="flex flex-col overflow-hidden rounded-28 p-2"
      hasShadow={hasShadow}
    >
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
