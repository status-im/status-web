import { forwardRef } from 'react'

import { ArrowDownIcon, MentionIcon } from '@status-im/icons/12'
import { Stack, styled } from '@tamagui/core'

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

const DynamicButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const { type, count, ...pressableProps } = props

  const color: ColorTokens = '$white-100'
  const showCount = Boolean(count)

  return (
    <Shadow variant="$2" borderRadius={999}>
      <Button
        {...(pressableProps as unknown as object)} // TODO: Tamagui has incorrect types for PressableProps
        ref={ref}
        type={type}
        iconOnly={showCount === false}
      >
        {type === 'mention' && <MentionIcon color={color} />}
        {showCount && (
          <Text size={13} weight="medium" color={color} wrap={false}>
            {count}
          </Text>
        )}
        {type === 'notification' && <ArrowDownIcon color={color} />}
      </Button>
    </Shadow>
  )
}

const _DynamicButton = forwardRef(DynamicButton)

export { _DynamicButton as DynamicButton }
export type { Props as DynamicButtonProps }

const Button = styled(Stack, {
  name: 'DynamicButton',
  tag: 'button',
  accessibilityRole: 'button',

  cursor: 'pointer',
  userSelect: 'none',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  height: 24,
  borderRadius: 999,
  animation: 'fast',
  space: 3,

  variants: {
    type: {
      mention: {
        backgroundColor: '$primary-50',
        hoverStyle: { backgroundColor: '$primary-60' },
        pressStyle: { backgroundColor: '$primary-50' },
      },

      notification: {
        backgroundColor: '$neutral-80-opa-70',
        hoverStyle: { backgroundColor: '$neutral-90-opa-70' },
        pressStyle: { backgroundColor: '$neutral-80-opa-80' },
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
