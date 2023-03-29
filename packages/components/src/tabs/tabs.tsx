import { Children, cloneElement, forwardRef } from 'react'

import { Content, List, Root, Trigger } from '@radix-ui/react-tabs'
import { Stack } from '@tamagui/web'
import { styled } from 'tamagui'

import { usePressableColors } from '../hooks/use-pressable-colors'
import { Text } from '../text'

import type { TextProps } from '../text'
import type { GetVariants } from '../types'
import type { Ref } from 'react'
import type { View } from 'react-native'

type Variants = GetVariants<typeof TriggerBase>

type Props = {
  children: React.ReactNode[]
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
}

const Tabs = (props: Props) => {
  const { children, defaultValue, value, onValueChange } = props

  return (
    <Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      {children}
    </Root>
  )
}

type ListProps = {
  children: React.ReactElement[]
  size: Variants['size']
}

const TabsList = (props: ListProps) => {
  const { children } = props

  return (
    <List asChild>
      <Stack flexDirection="row" gap={8}>
        {Children.map(children, child => (
          <Trigger asChild value={child.props.value}>
            {cloneElement(child, { size: props.size })}
          </Trigger>
        ))}
      </Stack>
    </List>
  )
}

type TriggerProps = {
  value: string
  children: string
  icon?: React.ReactElement
  count?: number
}

// TODO: Add counter
const TabsTrigger = (props: TriggerProps, ref: Ref<View>) => {
  const { icon = null, children, ...triggerProps } = props

  // props coming from parent List and Trigger, not passed by the user (line 52)
  const providedProps = props as TriggerProps & {
    size: 24 | 32
    'aria-selected': boolean
  }

  const { color, pressableProps } = usePressableColors(
    {
      default: '$neutral-100',
      hover: '$neutral-100',
      press: '$neutral-100',
      active: '$white-100',
    },
    providedProps
  )

  const { size, 'aria-selected': selected } = providedProps

  const textSize = triggerTextSizes[size]

  return (
    <TriggerBase
      {...triggerProps}
      {...pressableProps}
      ref={ref}
      size={size}
      active={selected}
    >
      {icon && cloneElement(icon, { size: iconSizes[size] })}
      <Text size={textSize} weight="medium" color={color}>
        {children}
      </Text>
    </TriggerBase>
  )
}

Tabs.List = TabsList
Tabs.Trigger = forwardRef(TabsTrigger)
Tabs.Content = Content

export { Tabs }
export type { Props as TabsProps }

const TriggerBase = styled(Stack, {
  tag: 'button',

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,

  variants: {
    size: {
      32: {
        height: 32,
        borderRadius: 10,
        paddingHorizontal: 12,
      },
      24: {
        height: 24,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
    },
    active: {
      true: {
        backgroundColor: '$neutral-50',
      },
      false: {
        backgroundColor: '$neutral-10',
        hoverStyle: {
          backgroundColor: '$neutral-20',
        },
      },
    },
  },
})

const triggerTextSizes: Record<Variants['size'], TextProps['size']> = {
  '32': 15,
  '24': 13,
}

// FIXME: icons will accept size as number
const iconSizes: Record<Variants['size'], number> = {
  '32': 16,
  '24': 12,
}
