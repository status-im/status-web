import { CloseIcon } from '@status-im/icons/12'
import { SadIcon } from '@status-im/icons/16'
import { Path, Svg } from 'react-native-svg'
import { Stack, Unspaced, XStack } from 'tamagui'

import { Avatar } from '../avatar'
import { Button } from '../button'
import { Paragraph } from '../typography'

interface Props {
  type: 'text' | 'gif' | 'image' | 'deleted'
  onClose?: VoidFunction
  name: string
  src: string
}

// FIXME: This should accept message or message ID and render the message accordingly
const Reply = (props: Props) => {
  const { type, name, onClose, src } = props

  const content =
    type !== 'deleted' ? (
      <XStack position="relative" space={4} alignItems="center" height={24}>
        <Unspaced>
          <Stack position="absolute" left={-24} top={10}>
            <Connector />
          </Stack>
        </Unspaced>

        <Avatar size={16} src={src} />

        <Paragraph variant="smaller" weight="semibold" color="$neutral-100">
          {name}
        </Paragraph>

        <Paragraph variant={11} weight="regular" color="$neutral-50">
          {type === 'text' && 'What is the meaning of life? '}
          {type === 'gif' && 'GIF'}
          {type === 'image' && '5 photos'}
        </Paragraph>
      </XStack>
    ) : (
      <XStack position="relative" space={4} alignItems="center" height={24}>
        <Unspaced>
          <Stack position="absolute" left={-24} top={10}>
            <Connector />
          </Stack>
        </Unspaced>

        <SadIcon color="$neutral-50" />

        <Paragraph variant="smaller" weight="medium" color="$neutral-50">
          Message deleted
        </Paragraph>
      </XStack>
    )

  return (
    <XStack
      space={8}
      justifyContent="space-between"
      alignItems="center"
      paddingLeft={24}
    >
      {content}

      {onClose && (
        <Button
          icon={<CloseIcon />}
          variant="outline"
          size={24}
          onPress={onClose}
        />
      )}
    </XStack>
  )
}

const Connector = () => (
  <Svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M16 1V1C8.16344 1 1 8.16344 1 16V16"
      stroke="#A1ABBD"
      strokeLinecap="round"
    />
  </Svg>
)

export { Reply }
export type { Props as ReplyProps }
