import { Button, Text } from '@status-im/components'

type Props = {
  title: string
  description: string
  action: string
}

const ActionCard = (props: Props) => {
  const { title, description, action } = props

  return (
    <div className="flex items-center rounded-[20px] border border-neutral-90 bg-neutral-95 px-5 py-3">
      <div className="grid flex-1 gap-px">
        <Text size={19} color="$white-100" weight="semibold">
          {title}
        </Text>
        <Text size={15} color="$white-100">
          {description}
        </Text>
      </div>
      <Button size={32} variant="darkGrey">
        {action}
      </Button>
    </div>
  )
}

export { ActionCard }
