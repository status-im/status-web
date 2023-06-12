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

const styles = cva(['rounded-xl border overflow-hidden'], {
  variants: {
    type: {
      info: 'bg-customisation-blue/10 border-customisation-blue/5',
      tip: 'bg-success-/10 border-success-/5',
      warn: 'bg-customisation-orange/10 border-customisation-orange/5',
    },
  },
})

export { Admonition }
export type { Props as InformationBoxProps }
