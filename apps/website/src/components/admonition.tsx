import { Shadow, Text } from '@status-im/components'
import { CustomizeIcon, InfoIcon, WarningIcon } from '@status-im/icons'
import { cva } from 'class-variance-authority'
import { match } from 'ts-pattern'

import { getNodeText } from '@/utils/get-node-text'

type Props = {
  type: 'info' | 'tip' | 'warn'
  children: string
}

const Admonition = (props: Props) => {
  const { type, children } = props

  return (
    <Shadow className={styles(props)}>
      <header className="flex items-center gap-2 p-3 capitalize">
        {match(type)
          .with('info', () => <InfoIcon size={12} />)
          .with('tip', () => <CustomizeIcon size={12} />)
          .with('warn', () => <WarningIcon size={12} />)
          .exhaustive()}
        <Text size={13} weight="semibold">
          {type}
        </Text>
      </header>
      <div className="bg-white-100 p-3">
        <Text size={13}>{getNodeText(children)}</Text>
      </div>
    </Shadow>
  )
}

const styles = cva(['overflow-hidden rounded-xl border'], {
  variants: {
    type: {
      info: 'border-customisation-blue/5 bg-customisation-blue/10',
      tip: 'border-success-/5 bg-success-/10',
      warn: 'border-customisation-orange/5 bg-customisation-orange/10',
    },
  },
})

export { Admonition }
export type { Props as InformationBoxProps }
