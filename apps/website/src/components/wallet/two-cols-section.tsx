import { Text } from '@status-im/components'

type TwoColsSectionProps = {
  direction?: 'ltr' | 'rtl'
  title: string
  description: string
  image: string
  imageAlt: string
  imageSecondary: string
  imageSecondaryAlt: string
  secondaryDescription: string
  secondaryTitle: string
  complemntaryDescription?: {
    title: string
    description: string
  }
}

const TwoColsSection = (props: TwoColsSectionProps) => {
  const {
    title,
    description,
    image,
    imageAlt,
    imageSecondary,
    imageSecondaryAlt,
    secondaryDescription,
    secondaryTitle,
    direction = 'ltr',
  } = props

  const directionOrder = direction === 'ltr' ? 'order-0' : 'order-1'
  return (
    <div className="relative z-[3] grid grid-flow-dense auto-rows-[1fr] grid-cols-2 gap-36 px-[160px]">
      <div
        className={`${directionOrder} flex justify-center overflow-hidden rounded-[32px] bg-[url('/images/wallet/border.png')] bg-[length:100%_100%] bg-no-repeat`}
      >
        <div className="bg-customisation-yellow/5 relative flex w-full justify-center py-[68px]">
          <div className="absolute left-0 top-0 h-full w-full bg-[url('/images/wallet/texture.png')] bg-contain bg-[left_top_0] bg-no-repeat" />
          <img
            src={image}
            alt={imageAlt}
            className="border-customisation-yellow/5 max-h-[724px] rounded-3xl border-4"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-col">
          <img src={imageSecondary} alt={imageSecondaryAlt} width="48px" />

          <div className="flex flex-col pt-4">
            <Text size={27} weight="semibold">
              {title}
            </Text>
            <div className="relative flex pt-1">
              <Text size={27}>{description}</Text>
            </div>
          </div>

          <div className="border-neutral-80/20 mt-16 flex flex-col rounded-[20px] border border-dashed p-4 pt-4">
            <Text size={19} weight="semibold">
              {secondaryTitle}
            </Text>
            <div className="flex pt-1">
              <Text size={19}>{secondaryDescription}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TwoColsSection }
