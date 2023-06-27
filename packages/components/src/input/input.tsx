import { cloneElement, forwardRef, useRef, useState } from 'react'

import { composeRefs } from '@radix-ui/react-compose-refs'
import { ClearIcon } from '@status-im/icons'
import { setupReactNative, Stack, styled } from '@tamagui/core'
import { focusableInputHOC } from '@tamagui/focusable'
import { TextInput } from 'react-native'

import { Button } from '../button'
import { Text } from '../text'

import type { GetProps } from '@tamagui/core'
import type { Ref } from 'react'

setupReactNative({
  TextInput,
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
  variant?: 'default' | 'retractable'
  size?: 40 | 32
  error?: boolean
  direction?: 'ltr' | 'rtl'
}

const _Input = (props: Props, ref: Ref<TextInput>) => {
  const {
    button,
    color = '$neutral-50',
    endLabel,
    error,
    icon,
    label,
    onClear,
    size = 40,
    placeholder,
    value,
    direction = 'ltr',
    variant = 'default',
    ...rest
  } = props

  const [isMinimized, setIsMinimized] = useState(variant === 'retractable')

  const isRetractable = variant === 'retractable'

  const inputRef = useRef<TextInput>(null)

  return (
    <Stack flexDirection={direction === 'ltr' ? 'row' : 'row-reverse'}>
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
      <InputContainer
        size={size}
        error={error}
        minimized={isMinimized}
        onPress={event => {
          event.stopPropagation()
          event.preventDefault()

          if (isRetractable && isMinimized) {
            setIsMinimized(false)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore ref is not inferred correctly here
            inputRef?.current?.focus()
          }
        }}
      >
        {icon ? (
          <Stack flexShrink={0}>{cloneElement(icon, { color })}</Stack>
        ) : null}
        <InputBase
          value={value}
          placeholder={isMinimized && !value ? '' : placeholder}
          flex={1}
          ref={composeRefs(ref, inputRef)}
          onBlur={() => {
            if (!value && isRetractable && !isMinimized) {
              setIsMinimized(true)
            }
          }}
          {...rest}
        />
        <Stack flexDirection="row" alignItems="center">
          {Boolean(onClear) && !!value && (
            <Stack
              role="button"
              accessibilityRole="button"
              pr={4}
              onPress={onClear}
              cursor="pointer"
              hoverStyle={{ opacity: 0.6 }}
              animation="fast"
            >
              <ClearIcon size={20} />
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

const InputBase = focusableInputHOC(InputFrame)

const InputContainer = styled(Stack, {
  name: 'InputContainer',
  tag: 'div',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,

  borderWidth: 1,
  borderColor: '$neutral-30',

  paddingHorizontal: 12,

  animation: 'fast',
  width: '100%',

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
    minimized: {
      true: {
        width: 32,
        paddingHorizontal: 0,
        paddingLeft: 5,

        cursor: 'pointer',
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
