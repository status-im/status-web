import { Children, cloneElement, forwardRef } from 'react'

import { Content, List, Root, Trigger } from '@radix-ui/react-tabs'
import { Stack } from '@tamagui/web'
import { View } from 'react-native'
import { styled } from 'tamagui'

import { Counter } from '../counter'
import { usePressableColors } from '../hooks/use-pressable-colors'
import { Step } from '../step'
import { Text } from '../text'

import type { TextProps } from '../text'
import type { GetVariants } from '../types'
import type { Ref } from 'react'

type Variants = GetVariants<typeof TriggerBase>

type Props = {
  // type: TriggerProps['type']
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

type TriggerProps =
  | {
      type: 'default'
      value: string
      children: string
    }
  | {
      type: 'icon'
      value: string
      children: string
      icon: React.ReactElement
    }
  | { type: 'counter'; value: string; children: string; count: number }
  | {
      type: 'step'
      value: string
      children: string
      step: number
    }

const TabsTrigger = (props: TriggerProps, ref: Ref<View>) => {
  const { children, ...triggerProps } = props

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
      {props.type === 'icon' &&
        cloneElement(props.icon, {
          size: iconSizes[size],
          color,
        })}

      {props.type === 'step' && <Step type="complete" value={props.step} />}

      <Text size={textSize} weight="medium" color={color}>
        {children}
      </Text>

      {props.type === 'counter' && (
        <Stack marginRight={-4}>
          <Counter type="secondary" value={props.count} />
        </Stack>
      )}
    </TriggerBase>
  )
}

Tabs.List = TabsList
Tabs.Trigger = forwardRef(TabsTrigger)
Tabs.Content = Content

export { Tabs }
export type { Props as TabsProps }

const TriggerBase = styled(View, {
  name: 'Trigger',
  role: 'tab',
  cursor: 'pointer',

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    size: {
      32: {
        height: 32,
        borderRadius: '$10',
        paddingHorizontal: 12,
        gap: 6,
      },
      24: {
        height: 24,
        borderRadius: '$8',
        paddingHorizontal: 8,
        gap: 4,
      },
    },
    active: {
      true: {
        cursor: 'default',
        backgroundColor: '$neutral-50',
      },
      false: {
        backgroundColor: '$neutral-10',
        hoverStyle: {
          backgroundColor: '$neutral-20',
        },
      },
    },
  } as const,
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
