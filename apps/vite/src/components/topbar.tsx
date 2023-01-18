import { Divider, IconButton, Paragraph } from '@status-im/components'
import { LockedIcon, MembersIcon, OptionsIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'

type Props = {
  membersVisisble: boolean
  onMembersPress: () => void
}

export const Topbar = (props: Props) => {
  const { membersVisisble, onMembersPress } = props

  return (
    <Stack
      flexDirection="row"
      height={56}
      alignItems="center"
      justifyContent="space-between"
      padding={16}
    >
      <Stack flexDirection="row" alignItems="center">
        <Paragraph weight="semibold" marginRight={4}>
          # random
        </Paragraph>
        <LockedIcon color="rgba(27, 39, 61, 0.4)" size={16} />
        <Divider height={16} />
        <Paragraph weight="medium" color="$neutral-80-opa-50" variant="smaller">
          Share random funny stuff with the community. Play nice.
        </Paragraph>
      </Stack>

      <Stack space={12} flexDirection="row">
        <IconButton
          icon={<MembersIcon />}
          selected={membersVisisble}
          onPress={onMembersPress}
        />
        <IconButton icon={<OptionsIcon />} />
      </Stack>
    </Stack>
  )
}
