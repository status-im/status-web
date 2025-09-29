import { Text } from '@status-im/components'
import { CustomizeIcon, InfoIcon, WarningRedIcon } from '@status-im/icons/16'
import { cva, cx } from 'class-variance-authority'
import { match } from 'ts-pattern'

import { renderText } from '~app/_utils/render-text'

type Props =
  | {
      type: 'info' | 'tip' | 'caution'
      children: React.ReactNode | React.ReactNode[]
    }
  | {
      type: 'beta'
      status: string
      children: React.ReactNode | React.ReactNode[]
    }

const Admonition = (props: Props) => {
  const { type } = props

  return (
    <div className={styles(props)}>
      <div className="min-w-[352px] max-w-[544px]">
        <header
          className={cx(
            'flex items-center gap-2 p-3',
            type !== 'beta' && 'capitalize'
          )}
        >
          {match(type)
            .with('info', () => (
              <InfoIcon className="text-customisation-blue-50" />
            ))
            .with('tip', () => <CustomizeIcon className="text-success-50" />)
            .with('caution', () => (
              <WarningRedIcon className="[&>path[fill='#E95460']]:fill-customisation-orange-50" />
            ))
            .with('beta', () => (
              <WarningRedIcon className="[&>path[fill='#E95460']]:fill-neutral-50" />
            ))
            .exhaustive()}
          <Text size={15} weight="semibold">
            {type === 'beta' ? props.status : type}
          </Text>
        </header>
        <div className="bg-white-100 p-3">
          {renderText({ children: props.children, size: 'text-15' })}
        </div>
      </div>
    </div>
  )
}

const styles = cva(
  ['min-w-[352px] max-w-[544px] overflow-hidden rounded-12 border shadow-1'],
  {
    variants: {
      type: {
        info: 'border-customisation-blue-50/5 bg-customisation-blue-50/10 ',
        tip: 'border-success-50/5 bg-success-50/10 ',
        caution:
          'border-customisation-orange-50/5 bg-customisation-orange-50/10 ',
        beta: 'border-neutral-20 bg-neutral-10 ',
      },
    },
  }
)

export { Admonition }
