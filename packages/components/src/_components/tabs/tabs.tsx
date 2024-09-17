'use client'

import { cva } from 'cva'
import * as Aria from 'react-aria-components'

import type { IconComponent } from '../types'
import type { VariantProps } from 'cva'
import type React from 'react'

type TabVariants = VariantProps<typeof tabStyles>

type TabsProps = Aria.TabsProps & {
  variant?: TabVariants['variant']
  size?: TabVariants['size']
}

const Root = (props: TabsProps) => {
  return <Aria.Tabs {...props} />
}

type TabListProps<T extends object> = Aria.TabListProps<T>

const TabList = <T extends object>(props: TabListProps<T>) => {
  return <Aria.TabList {...props} className="flex gap-3" />
}

type TabProps = Aria.TabProps & {
  variant?: TabVariants['variant']
  size?: TabVariants['size']
  icon?: IconComponent
  children: React.ReactNode
}

const Tab = (props: TabProps) => {
  const { icon: Icon, children, variant = 'gray', size = '32' } = props

  return (
    <Aria.Tab
      {...props}
      className={tabStyles({
        variant,
        size,
        className: 'group',
      })}
    >
      {Icon && (
        <Icon className="size-4 text-neutral-50 group-aria-selected:text-white-100" />
      )}
      {children}
    </Aria.Tab>
  )
}

const tabStyles = cva({
  base: ['inline-flex cursor-default items-center gap-1 whitespace-nowrap'],
  variants: {
    variant: {
      gray: [
        // light
        'bg-neutral-10 text-neutral-100 hover:bg-neutral-20',
        'aria-selected:bg-neutral-50 aria-selected:text-white-100 aria-selected:hover:bg-neutral-50',
        // light blur
        'blurry:bg-neutral-80/5 blurry:hover:bg-neutral-80/10',
        'blurry:aria-selected:bg-neutral-80/60 blurry:aria-selected:text-white-100 blurry:aria-selected:hover:bg-neutral-80/60',

        //dark
        'dark:bg-neutral-80 dark:text-white-100 dark:hover:bg-neutral-70',
        'dark:aria-selected:bg-neutral-60 dark:hover:aria-selected:bg-neutral-60',
        // dark blur
        'blurry:dark:bg-white-5 blurry:dark:text-white-100 blurry:dark:hover:bg-white-10',
        'blurry:dark:aria-selected:bg-white-20 blurry:dark:hover:aria-selected:bg-white-20',
      ],
      darkGray: [
        // light
        'bg-neutral-20 text-neutral-100 hover:bg-neutral-30',
        'aria-selected:bg-neutral-50 aria-selected:text-white-100 aria-selected:hover:bg-neutral-50',
        // light blur
        'blurry:bg-neutral-80/5 blurry:hover:bg-neutral-80/10',
        'blurry:aria-selected:bg-neutral-80/60 blurry:aria-selected:text-white-100 blurry:aria-selected:hover:bg-neutral-80/60',

        //dark
        'dark:bg-neutral-90 dark:text-white-100 dark:hover:bg-neutral-80',
        'dark:aria-selected:bg-neutral-60 dark:hover:aria-selected:bg-neutral-60',
        // dark blur
        'blurry:dark:bg-white-5 blurry:dark:text-white-100 blurry:dark:hover:bg-white-10',
        'blurry:dark:aria-selected:bg-white-20 blurry:dark:hover:aria-selected:bg-white-20',
      ],
    },
    size: {
      '32': 'h-6 rounded-10 px-3 text-15 font-medium',
      '24': 'h-6 rounded-8 px-2 text-13 font-medium',
    },
  },

  defaultVariants: {
    size: '32',
    variant: 'gray',
  },
})

type TabPanelProps = Aria.TabPanelProps

const TabPanel = (props: TabPanelProps) => {
  return <Aria.TabPanel {...props} />
}

export { TabPanel as Content, TabList as List, Root, Tab as Trigger }
export type { TabListProps, TabPanelProps, TabProps, TabsProps }
