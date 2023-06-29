import { Text } from '@status-im/components'
import { cx } from 'class-variance-authority'

type Props = {
  title: string
  description: string
  description2?: string
  children: React.ReactNode
  dark?: boolean
}

export const SectionLarge = (props: Props) => {
  const { title, description, description2, children, dark = false } = props

  return (
    <div className="pt-40">
      <div className="mx-auto max-w-[702px] gap-4 pb-20 text-center">
        <h2 className={cx('pb-4 text-40 lg:text-64', dark && 'text-white-100')}>
          {title}
        </h2>
        <Text size={27} color={dark ? '$white-100' : ''}>
          {description}
        </Text>
        {description2 && (
          <>
            <div className="pb-4 text-40 text-neutral-40">&hellip;</div>
            <Text size={27} color={dark ? '$white-100' : ''}>
              {description2}
            </Text>
          </>
        )}
      </div>
      {children}
    </div>
  )
}
