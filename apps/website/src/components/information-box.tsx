import { Shadow, Text } from '@status-im/components'
import { CustomizeIcon, InfoIcon, WarningIcon } from '@status-im/icons'
import { cva } from 'class-variance-authority'

type Props = {
  type: 'info' | 'tip' | 'caution'
  message: string
}

const InformationBox = (props: Props) => {
  const { type, message } = props

  return (
    <Shadow className={styles(props)}>
      <header className="flex items-center gap-2 p-3 capitalize">
        <InfoIcon size={12} />
        <CustomizeIcon size={12} />
        <WarningIcon size={12} />
        <Text size={13} weight="semibold">
          {type}
        </Text>
      </header>
      <div className="bg-white-100 p-3">
        <Text size={13}>{message}</Text>
      </div>
    </Shadow>
  )
}

const styles = cva(['rounded-xl border overflow-hidden'], {
  variants: {
    type: {
      info: 'bg-customisation-blue/10 border-customisation-blue/5',
      tip: 'bg-success-/10 border-success-/5',
      caution: 'bg-customisation-orange/10 border-customisation-orange/5',
    },
  },
})

export { InformationBox }
