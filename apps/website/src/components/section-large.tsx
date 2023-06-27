import { Text } from '@status-im/components'

type Props = {
  title: string
  description: string
  description2?: string
  children: React.ReactNode
}

export const SectionLarge = (props: Props) => {
  const { title, description, description2, children } = props

  return (
    <div className="border-y-2 border-solid pt-40">
      <div className="mx-auto max-w-[702px] gap-4 pb-20 text-center">
        <h2 className="pb-4 text-40 lg:text-64">{title}</h2>
        <Text size={27}>{description}</Text>
        {description2 && (
          <>
            <div className="pb-4 text-40 text-neutral-40">&hellip;</div>
            <Text size={27}>{description2}</Text>
          </>
        )}
      </div>
      {children}
    </div>
  )
}
