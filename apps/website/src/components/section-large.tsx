import { Text } from '@status-im/components'

type Props = {
  title: string
  description: string
  children: React.ReactNode
}

export const SectionLarge = (props: Props) => {
  const { title, description, children } = props

  return (
    <div>
      <div className="mx-auto max-w-[702px] gap-4 text-center">
        <h2 className="text-[64px] font-bold leading-[68px]">{title}</h2>
        <Text size={27}>{description}</Text>
      </div>
      {children}
    </div>
  )
}
