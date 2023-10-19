import { forwardRef } from 'react'

import { ArrowDownIcon, MentionIcon } from '@status-im/icons'
import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Shadow } from '../shadow'
import { Text } from '../text'

import type { GetVariants, PressableProps } from '../types'
import type { ColorTokens } from '@tamagui/core'
import type { Ref } from 'react'

type Variants = GetVariants<typeof Button>

type Props = PressableProps & {
  type: Variants['type']
  count: number
}

const DynamicButton = (props: Props, ref: Ref<View>) => {
  const { type, count, ...buttonProps } = props

  const color: ColorTokens = '$white-100'
  const showCount = Boolean(count)

  return (
    <Shadow variant="$2" borderRadius="$full">
      <Button
        {...buttonProps}
        ref={ref}
        type={type}
        iconOnly={showCount === false}
      >
        {type === 'mention' && <MentionIcon size={12} color={color} />}
        {showCount && (
          <Text size={13} weight="medium" color={color} wrap={false}>
            {count}
          </Text>
        )}
        {type === 'notification' && <ArrowDownIcon size={12} color={color} />}
      </Button>
    </Shadow>
  )
}

const _DynamicButton = forwardRef(DynamicButton)

export { _DynamicButton as DynamicButton }
export type { Props as DynamicButtonProps }

const Button = styled(View, {
  name: 'DynamicButton',
  role: 'button',

  cursor: 'pointer',
  userSelect: 'none',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  height: 24,
  borderRadius: '$full',
  animation: 'fast',
  space: 3,

  variants: {
    type: {
      mention: {
        backgroundColor: '$blue-50',
        hoverStyle: { backgroundColor: '$blue-60' },
        pressStyle: { backgroundColor: '$blue-50' },
      },

      notification: {
        backgroundColor: '$neutral-80/70',
        hoverStyle: { backgroundColor: '$neutral-90/70' },
        pressStyle: { backgroundColor: '$neutral-80/80' },
      },
    },

    iconOnly: {
      true: {
        width: 24,
      },
      false: {
        paddingHorizontal: 8,
      },
    },
  } as const,
})
