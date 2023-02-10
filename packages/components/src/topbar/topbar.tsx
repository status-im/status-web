import { Divider, IconButton, Paragraph } from '@status-im/components'
import {
  ArrowLeftIcon,
  LockedIcon,
  MembersIcon,
  OptionsIcon,
} from '@status-im/icons/20'
import { Stack } from '@tamagui/core'
import { BlurView } from 'expo-blur'

import type { GetProps, StackProps } from '@tamagui/core'

type BaseProps = GetProps<typeof Stack>

type Props = {
  membersVisisble: boolean
  onMembersPress: () => void
  goBack?: () => void
  title?: string
  description?: string
  icon?: React.ReactNode
  refForScroll?: React.RefObject<HTMLDivElement>
  backgroundColor?: StackProps['backgroundColor']
  isBlurred?: boolean
} & BaseProps

const Topbar = (props: Props) => {
  const {
    membersVisisble,
    onMembersPress,
    goBack,
    title,
    description,
    icon,
    backgroundColor,
    isBlurred,
    ...rest
  } = props

  return (
    <BlurView intensity={40} style={{ zIndex: 100 }}>
      <Stack
        flexDirection="row"
        height={56}
        alignItems="center"
        justifyContent="space-between"
        padding={16}
        backgroundColor={backgroundColor || '$background'}
        borderBottomWidth={1}
        borderColor={isBlurred ? 'transparent' : '$neutral-80-opa-10'}
        width="100%"
        {...rest}
      >
        <Stack flexDirection="row" alignItems="center" flexWrap="wrap">
          <Stack mr={12} $gtSm={{ display: 'none' }}>
            <IconButton
              icon={<ArrowLeftIcon />}
              onPress={() => goBack?.()}
              blurred={isBlurred}
            />
          </Stack>

          {icon && <Stack marginRight={12}>{icon}</Stack>}

          {title && (
            <Paragraph weight="semibold" marginRight={4}>
              {title}
            </Paragraph>
          )}

          <LockedIcon color="$neutral-80-opa-40" />
          <Divider height={16} $sm={{ display: 'none' }} />
        </Stack>

        <Stack
          space={12}
          flexDirection="row"
          alignItems="center"
          justifyContent={description ? 'space-between' : 'flex-end'}
          flexGrow={1}
          flexShrink={1}
          $sm={{ justifyContent: 'flex-end' }}
        >
          {description && (
            <Paragraph
              weight="medium"
              color="$neutral-80-opa-50"
              variant="smaller"
              $sm={{ display: 'none' }}
              flexShrink={1}
              flexGrow={1}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {description}
            </Paragraph>
          )}
          <Stack $sm={{ display: 'none' }}>
            <IconButton
              icon={<MembersIcon />}
              selected={membersVisisble}
              onPress={onMembersPress}
              blurred={isBlurred}
            />
          </Stack>
          <IconButton icon={<OptionsIcon />} blurred={isBlurred} />
        </Stack>
      </Stack>
    </BlurView>
  )
}

export { Topbar }
