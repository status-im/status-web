import {
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { cva } from 'cva'

import type { IconElement } from '../types'
import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof rootStyles>

const SegmentedControlContext = createContext<
  Pick<Variants, 'variant' | 'size'>
>({})

function useSegmentedControlContext() {
  const context = useContext(SegmentedControlContext)

  if (!context) {
    throw new Error(
      'useSegmentedControlContext must be used within a <SegmentedControl.Root />',
    )
  }

  return context
}

type RootProps = Omit<ToggleGroup.ToggleGroupSingleProps, 'type'> & {
  value: string
  onValueChange: (value: string) => void
  variant?: Variants['variant']
  size?: Variants['size']
}

const rootStyles = cva({
  base: 'relative flex flex-1 items-center justify-center gap-0.5 rounded-10 p-0.5',
  variants: {
    variant: {
      grey: 'bg-neutral-10 blur:bg-neutral-80/5 blur:backdrop-blur-[20px] dark:bg-neutral-80 blur:dark:bg-white-5',
      darkGrey: 'bg-neutral-20 dark:bg-neutral-90',
    },
    size: {
      '24': 'h-6',
      '32': 'h-8',
    },
  },
})

const activeSegmentStyles = cva({
  base: 'pointer-events-none absolute inset-y-0.5 left-0 flex-1 rounded-8 transition-all duration-200 ease-out',
  variants: {
    variant: {
      grey: 'bg-neutral-50 blur:bg-neutral-80/60 dark:bg-neutral-60 blur:dark:bg-white-20',
      darkGrey: 'bg-neutral-50 dark:bg-neutral-60',
    },
  },
})

export const Root = forwardRef<
  React.ElementRef<typeof ToggleGroup.Root>,
  RootProps
>((props, ref) => {
  const {
    children,
    variant = 'grey',
    size = '32',
    value,
    onValueChange,
    ...rootProps
  } = props

  const rootRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => rootRef.current!)

  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const activeButton =
      rootRef.current!.querySelector<HTMLButtonElement>('[data-state="on"]')!

    if (activeButton) {
      setIndicatorStyle({
        width: activeButton.offsetWidth,
        transform: `translateX(${activeButton.offsetLeft}px)`,
      })
    }
  }, [value])

  return (
    <SegmentedControlContext.Provider
      value={useMemo(() => ({ size, variant }), [size, variant])}
    >
      <ToggleGroup.Root
        {...rootProps}
        ref={rootRef}
        type="single"
        className={rootStyles({ size, variant })}
        value={value}
        onValueChange={value => {
          // Ensuring there is always a value
          // @see https://www.radix-ui.com/primitives/docs/components/toggle-group#ensuring-there-is-always-a-value
          if (value) {
            onValueChange(value)
          }
        }}
      >
        <div
          className={activeSegmentStyles({ variant })}
          style={indicatorStyle}
        />
        {children}
      </ToggleGroup.Root>
    </SegmentedControlContext.Provider>
  )
})

Root.displayName = 'Root'

/**
 * Item
 */

const itemStyles = cva({
  base: [
    'group relative z-10 flex flex-1 select-none items-center justify-center gap-1 whitespace-nowrap rounded-8 bg-transparent font-medium transition-all duration-300 ease-out',
    'text-neutral-100 data-[state="on"]:text-white-100 dark:text-white-100',
  ],

  variants: {
    variant: {
      grey: [
        'data-[state="off"]:hover:bg-neutral-20 data-[state="off"]:blur:hover:bg-neutral-80/5 data-[state="off"]:dark:hover:bg-neutral-70 data-[state="off"]:dark:blur:hover:bg-white-5',
      ],
      darkGrey: [
        'data-[state="off"]:hover:bg-neutral-30 data-[state="off"]:dark:hover:bg-neutral-80',
      ],
    },
    size: {
      '24': 'h-6 px-2 text-13',
      '32': 'h-7 px-3 text-15',
    },
  },
})

const iconStyles = cva({
  base: [
    'size-5 text-neutral-50 group-data-[state="on"]:text-white-100 dark:text-white-40',
  ],
  variants: {
    iconOnly: {
      true: '',
      false: '-ml-0.5',
    },
  },
})

type ItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroup.Item>,
  'children'
> &
  (
    | {
        icon?: IconElement
        children: React.ReactNode
      }
    | {
        icon: IconElement
        children?: never
        'aria-label': string
      }
  )

export const Item = forwardRef<
  React.ElementRef<typeof ToggleGroup.Item>,
  ItemProps
>((props, ref) => {
  const { icon, children, ...itemProps } = props

  const { size, variant } = useSegmentedControlContext()

  const iconOnly = children ? false : true

  return (
    <ToggleGroup.Item
      {...itemProps}
      ref={ref}
      className={itemStyles({ size, variant })}
    >
      {icon && (
        <>
          {cloneElement(icon, {
            className: iconStyles({ iconOnly }),
          })}
        </>
      )}
      {children}
    </ToggleGroup.Item>
  )
})

Item.displayName = 'Item'
