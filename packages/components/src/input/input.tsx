import { cloneElement, forwardRef } from 'react'

import { ClearIcon } from '@status-im/icons'
import { setupReactNative, Stack, styled } from '@tamagui/core'
import { focusableInputHOC } from '@tamagui/focusable'
import { TextInput } from 'react-native'

import { Button } from '../button'
import { IconButton } from '../icon-button'
import { Text } from '../text'

import type { GetProps } from '@tamagui/core'
import type { Ref } from 'react'

setupReactNative({
  TextInput,
})

const InputFrame = styled(
  TextInput,
  {
    tag: 'input',
    name: 'Input',

    outlineWidth: 0,
    borderColor: '$neutral-20',

    color: '$neutral-100',
    placeholderTextColor: '$placeHolderColor',

    backgroundColor: 'transparent',

    // this fixes a flex bug where it overflows container
    minWidth: 0,

    variants: {
      blurred: {
        true: {
          placeholderTextColor: '$placeHolderColorBlurred',
        },
      },
    } as const,
  },
  {
    isInput: true,
  }
)

const InputContainer = styled(Stack, {
  name: 'InputContainer',
  tag: 'div',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,

  borderWidth: 1,
  borderColor: '$neutral-20',

  paddingHorizontal: 12,

  animation: 'fast',

  hoverStyle: {
    borderColor: '$neutral-40',
  },

  focusStyle: {
    borderColor: '$neutral-40',
  },

  pressStyle: {
    borderColor: '$neutral-40',
  },

  variants: {
    size: {
      40: {
        height: 40,
        paddingHorizontal: 16,
        borderRadius: '$12',
      },
      32: {
        height: 32,
        paddingHorizontal: 8,
        borderRadius: '$10',
      },
    },
    error: {
      true: {
        borderColor: '$danger-50-opa-40',
      },
    },

    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'default',
      },
    },
  } as const,
})

type Props = GetProps<typeof InputFrame> & {
  button?: {
    label: string
    onPress: () => void
  }
  endLabel?: string
  icon?: React.ReactElement
  label?: string
  onClear?: () => void
  size?: 40 | 32
  error?: boolean
}

const InputBase = focusableInputHOC(InputFrame)

const _Input = (props: Props, ref: Ref<HTMLDivElement>) => {
  const {
    button,
    color = '$neutral-50',
    endLabel,
    error,
    icon,
    label,
    onClear,
    size = 40,
    value,
    ...rest
  } = props
  return (
    <Stack>
      {Boolean(label || endLabel) && (
        <Stack flexDirection="row" justifyContent="space-between" pb={8}>
          {label && (
            <Text size={13} color="$neutral-50" weight="medium">
              {label}
            </Text>
          )}
          {endLabel && (
            <Text size={13} color="$neutral-50">
              {endLabel}
            </Text>
          )}
        </Stack>
      )}
      <InputContainer size={size} ref={ref} error={error}>
        {icon ? cloneElement(icon, { color }) : null}
        <InputBase value={value} {...rest} flex={1} />
        <Stack flexDirection="row" alignItems="center">
          {Boolean(onClear) && !!value && (
            <Stack pr={4}>
              <IconButton
                variant="ghost"
                icon={<ClearIcon size={20} />}
                onPress={onClear}
              />
            </Stack>
          )}
          {button && (
            <Button onPress={button.onPress} variant="outline" size={24}>
              {button.label}
            </Button>
          )}
        </Stack>
      </InputContainer>
    </Stack>
  )
}

const Input = forwardRef(_Input)

export { Input }
export type { Props as InputProps }
