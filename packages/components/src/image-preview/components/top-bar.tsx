import {
  CloseIcon,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  ForwardIcon,
  InfoIcon,
  OptionsIcon,
  ShareIcon,
} from '@status-im/icons/20'
import { Stack } from '@tamagui/core'

import { DropdownMenu } from '../../dropdown-menu'
import { IconButton } from '../../icon-button'
import { Text } from '../../text'

type Props = {
  drawerOpen?: boolean
  onShowInfo: () => void
  onClose: () => void
  messageInfo: {
    author: string
    date: string
  }
}
const TopBar = (props: Props) => {
  const { drawerOpen, messageInfo, onClose, onShowInfo } = props
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Stack flexDirection="row" alignItems="center">
        <IconButton
          icon={<CloseIcon />}
          onPress={() => onClose()}
          variant="dark"
        />
        <Stack pl={12}>
          <Text size={15} color="$white-100" weight="semibold" truncate>
            {messageInfo.author}
          </Text>
          <Text size={13} color="$white-40" weight="medium" truncate>
            {messageInfo.date}
          </Text>
        </Stack>
      </Stack>
      <Stack flexDirection="row" alignItems="center" gap={12}>
        <IconButton
          selected={drawerOpen}
          icon={<InfoIcon />}
          variant="dark"
          onPress={() => onShowInfo()}
        />
        <IconButton icon={<ShareIcon color="$white-100" />} variant="dark" />
        <DropdownMenu>
          <IconButton
            icon={<OptionsIcon color="$white-100" />}
            variant="dark"
          />
          <DropdownMenu.Content align="end" width={188}>
            <DropdownMenu.Item
              icon={<CopyIcon />}
              label="Copy image"
              onSelect={() => console.log('click')}
            />
            <DropdownMenu.Item
              icon={<DownloadIcon />}
              label="Save image"
              onSelect={() => console.log('click')}
            />
            <DropdownMenu.Item
              icon={<ForwardIcon />}
              label="Forward"
              onSelect={() => console.log('click')}
            />
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              icon={<DeleteIcon />}
              label="Delete for me"
              onSelect={() => console.log('click')}
              danger
            />
          </DropdownMenu.Content>
        </DropdownMenu>
      </Stack>
    </Stack>
  )
}

export { TopBar }
