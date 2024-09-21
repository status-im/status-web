'use client'

import {
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from 'react'

import * as Tabs from '@radix-ui/react-tabs'
import { cva, cx } from 'cva'
import { match, P } from 'ts-pattern'

import { Step } from '../step'

import type { IconElement } from '../types'
import type { VariantProps } from 'cva'

type TabVariants = VariantProps<typeof tabStyles>

type RootProps = React.ComponentProps<typeof Tabs.Root> & {
  variant?: TabVariants['variant']
  size?: TabVariants['size']
}

const TabsContext = createContext<Pick<RootProps, 'size' | 'variant'>>({})

export const Root = (props: RootProps) => {
  const { size = '32', variant = 'grey', ...rootProps } = props

  return (
    <TabsContext.Provider
      value={useMemo(() => ({ size, variant }), [size, variant])}
    >
      <Tabs.Root {...rootProps} />
    </TabsContext.Provider>
  )
}

export const List = forwardRef<
  React.ElementRef<typeof Tabs.List>,
  React.ComponentPropsWithoutRef<typeof Tabs.List>
>((props, ref) => {
  const { size } = useContext(TabsContext)!

  return (
    <Tabs.List
      {...props}
      ref={ref}
      className={cx('flex', size === '32' && 'gap-3', size === '24' && 'gap-2')}
    />
  )
})

List.displayName = Tabs.List.displayName

type TabProps = React.ComponentProps<typeof Tabs.Trigger> & {
  children: React.ReactNode
} & (
    | {
        icon?: IconElement
        step?: never
      }
    | {
        step?: number
        icon?: never
      }
  )

export const Trigger = forwardRef<
  React.ElementRef<typeof Tabs.Trigger>,
  TabProps
>((props, ref) => {
  const { children, ...rest } = props

  const { size, variant } = useContext(TabsContext)!

  return (
    <Tabs.Trigger {...rest} ref={ref} className={tabStyles({ variant, size })}>
      {match(props)
        .with({ icon: P.nonNullable }, ({ icon }) => (
          <span className={iconStyles({ size })}>{cloneElement(icon)}</span>
        ))
        .with({ step: P.nonNullable }, ({ step }) => (
          <span className={stepStyles({ size })}>
            <Step size={18} variant="primary" value={step} />
          </span>
        ))
        .otherwise(() => null)}
      {/* {icon && (
        <span className={iconStyles({ size })}>{cloneElement(icon)}</span>
      )} */}
      <span className="flex-1 whitespace-nowrap">{children}</span>
    </Tabs.Trigger>
  )
})

Trigger.displayName = Tabs.Trigger.displayName

const tabStyles = cva({
  base: [
    'group inline-flex items-center gap-1 whitespace-nowrap',
    'disabled:pointer-events-none disabled:opacity-30',
  ],
  variants: {
    variant: {
      grey: [
        // light
        'bg-neutral-10 text-neutral-100 hover:bg-neutral-20',
        'data-[state=active]:bg-neutral-50 data-[state=active]:text-white-100 data-[state=active]:hover:bg-neutral-50',
        // light blur
        'blurry:bg-neutral-80/5 blurry:hover:bg-neutral-80/10',
        'blurry:data-[state=active]:bg-neutral-80/60 blurry:data-[state=active]:text-white-100 blurry:data-[state=active]:hover:bg-neutral-80/60',

        //dark
        'dark:bg-neutral-80 dark:text-white-100 dark:hover:bg-neutral-70',
        'dark:data-[state=active]:bg-neutral-60 dark:hover:data-[state=active]:bg-neutral-60',
        // dark blur
        'blurry:dark:bg-white-5 blurry:dark:text-white-100 blurry:dark:hover:bg-white-10',
        'blurry:dark:data-[state=active]:bg-white-20 blurry:dark:hover:data-[state=active]:bg-white-20',
      ],
      'dark-grey': [
        // light
        'bg-neutral-20 text-neutral-100 hover:bg-neutral-30',
        'data-[state=active]:bg-neutral-50 data-[state=active]:text-white-100 data-[state=active]:hover:bg-neutral-50',
        // light blur
        'blurry:bg-neutral-80/5 blurry:hover:bg-neutral-80/10',
        'blurry:data-[state=active]:bg-neutral-80/60 blurry:data-[state=active]:text-white-100 blurry:data-[state=active]:hover:bg-neutral-80/60',

        //dark
        'dark:bg-neutral-90 dark:text-white-100 dark:hover:bg-neutral-80',
        'dark:data-[state=active]:bg-neutral-60 dark:hover:data-[state=active]:bg-neutral-60',
        // dark blur
        'blurry:dark:bg-white-5 blurry:dark:text-white-100 blurry:dark:hover:bg-white-10',
        'blurry:dark:data-[state=active]:bg-white-20 blurry:dark:hover:data-[state=active]:bg-white-20',
      ],
    },
    size: {
      '32': 'h-8 rounded-10 px-3 text-15 font-medium',
      '24': 'h-6 rounded-8 px-2 text-13 font-medium',
    },
  },

  defaultVariants: {
    size: '32',
    variant: 'grey',
  },
})

const iconStyles = cva({
  base: [
    'text-neutral-50 group-data-[state=active]:text-white-100 [&>svg]:size-full',
  ],
  variants: {
    size: {
      '32': '-ml-0.5 size-4',
      '24': 'size-3',
    },
  },
})

const stepStyles = cva({
  base: 'inline-flex',
  variants: {
    size: {
      '32': '-ml-1.5',
      '24': '-ml-1',
    },
  },
})

export const Content = forwardRef<
  React.ElementRef<typeof Tabs.Content>,
  React.ComponentPropsWithoutRef<typeof Tabs.Content>
>((props, ref) => {
  return <Tabs.Content {...props} ref={ref} />
})

Content.displayName = Tabs.Content.displayName
