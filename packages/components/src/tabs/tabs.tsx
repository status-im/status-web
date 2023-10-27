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
  variant: Variants['variant']
  size: Variants['size']
}

const TabsList = (props: ListProps) => {
  const { children } = props

  return (
    <List asChild>
      <Stack flexDirection="row" gap={8}>
        {Children.map(children, child => (
          <Trigger asChild value={child.props.value}>
            {cloneElement(child, { size: props.size, variant: props.variant })}
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
    variant: Variants['variant']
  }

  const { size, 'aria-selected': selected, variant } = providedProps

  const { color, pressableProps } = usePressableColors(
    {
      default: variant === 'blur_darkGrey' ? '$white-100' : '$neutral-100',
      hover: variant === 'blur_darkGrey' ? '$white-100' : '$neutral-100',
      press: variant === 'blur_darkGrey' ? '$white-100' : '$neutral-100',
      active: '$white-100',
    },
    providedProps
  )

  const textSize = triggerTextSizes[size]

  return (
    <TriggerBase
      {...triggerProps}
      {...pressableProps}
      ref={ref}
      size={size}
      variant={variant}
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
    variant: {
      grey: {
        backgroundColor: '$neutral-10',
        hoverStyle: {
          backgroundColor: '$neutral-20',
        },
      },
      darkGrey: {
        backgroundColor: '$neutral-20',
        hoverStyle: {
          backgroundColor: '$neutral-30',
        },
      },

      blur_grey: {
        backgroundColor: '$neutral-80/5',
        hoverStyle: {
          backgroundColor: '$neutral-80/10',
          // backgroundColor: '$neutral-80/60',
        },
      },
      blur_darkGrey: {
        backgroundColor: '$white-5',
        hoverStyle: {
          backgroundColor: '$white-10',
          // backgroundColor: '$white-20',
        },
      },
    },
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      true: (_v, { props }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const variant = (props as any).variant as Variants['variant']

        if (variant === 'grey' || variant === 'darkGrey') {
          return {
            backgroundColor: '$neutral-50',
            hoverStyle: { backgroundColor: '$neutral-50' },
            pressStyle: { backgroundColor: '$neutral-50' },
          }
        }

        if (variant === 'blur_grey') {
          return {
            backgroundColor: '$neutral-80/60',
            hoverStyle: { backgroundColor: '$neutral-80/60' },
            pressStyle: { backgroundColor: '$neutral-80/60' },
          }
        }

        if (variant === 'blur_darkGrey') {
          return {
            backgroundColor: '$white-20',
            hoverStyle: { backgroundColor: '$white-20' },
            pressStyle: { backgroundColor: '$white-20' },
          }
        }
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
