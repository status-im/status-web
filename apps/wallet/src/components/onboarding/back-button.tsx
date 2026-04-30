import { Button } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'

type Props = { href: string } | { onClick: () => void }

export function BackButton(props: Props) {
  return (
    <Button
      {...props}
      variant="grey"
      icon={<ArrowLeftIcon color="$neutral-100" />}
      aria-label="Back"
      size="32"
    />
  )
}
