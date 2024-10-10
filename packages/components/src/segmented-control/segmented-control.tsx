import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { cva, cx } from 'cva'

import type { IconElement } from '../types'
import type { VariantProps } from 'cva'
import type { ReactNode } from 'react'

const tabContainerStyles = cva({
  base: 'relative flex flex-1 items-center justify-center gap-0.5 rounded-10 p-0.5',
  variants: {
    type: {
      grey: 'bg-neutral-10 blur:bg-neutral-80/5 blur:backdrop-blur-[20px] dark:bg-neutral-80 blur:dark:bg-white-5',
      'dark-grey': 'bg-neutral-20 dark:bg-neutral-90',
    },
    size: {
      '24': 'h-6',
      '32': 'h-8',
    },
  },
})

const activeTabStyles = cva({
  base: 'absolute left-0 flex-1 rounded-8 transition-all duration-300 ease-out',
  variants: {
    type: {
      grey: 'bg-neutral-50 blur:bg-neutral-80/60 dark:bg-neutral-60 blur:dark:bg-white-20',
      'dark-grey': 'bg-neutral-50 dark:bg-neutral-60',
    },
    size: {
      '24': 'h-[22px]',
      '32': 'h-7',
    },
  },
})

const segmentStyles = cva({
  base: 'relative z-10 flex flex-1 select-none items-center justify-center whitespace-nowrap rounded-8 font-medium transition-all duration-300 ease-out',

  variants: {
    active: {
      true: 'text-white-100',
      false: 'bg-transparent text-neutral-100 dark:text-white-100',
    },
    type: {
      grey: '',
      'dark-grey': '',
    },
    variant: {
      default: '',
      emoji: 'gap-1',
      'emoji-only': '',
      icon: 'gap-1',
      'icon-only': '',
    },
    size: {
      '24': 'h-[22px] text-13',
      '32': 'h-7 text-15',
    },
  },
  compoundVariants: [
    {
      type: 'grey',
      active: false,
      className:
        'hover:bg-neutral-20 blur:hover:bg-neutral-80/5 dark:hover:bg-neutral-70 dark:blur:hover:bg-white-5',
    },
    {
      type: 'dark-grey',
      active: false,
      className: 'hover:bg-neutral-30 dark:hover:bg-neutral-80',
    },
    {
      variant: 'default',
      size: '24',
      className: 'px-2',
    },
    {
      variant: 'default',
      size: '32',
      className: 'px-3',
    },
    {
      variant: 'emoji',
      size: '24',
      className: 'pl-[6px] pr-2',
    },
    {
      variant: 'emoji',
      size: '32',
      className: 'pl-[10px] pr-3',
    },
    {
      variant: 'emoji-only',
      size: '24',
      className: 'px-1',
    },
    {
      variant: 'emoji-only',
      size: '32',
      className: 'px-1.5',
    },
    {
      variant: 'icon',
      size: '24',
      className: 'pl-[6px] pr-2',
    },
    {
      variant: 'icon',
      size: '32',
      className: 'pl-[10px] pr-3',
    },
    {
      variant: 'icon-only',
      size: '24',
      className: 'px-1',
    },
    {
      variant: 'icon-only',
      size: '32',
      className: 'px-1.5',
    },
  ],
})

type SegmentButtonProps = {
  children?: ReactNode
  active?: boolean
  value: string
  size?: '24' | '32'
  type?: 'grey' | 'dark-grey'
} & React.RefAttributes<HTMLButtonElement>

export const Button = forwardRef<
  React.ElementRef<typeof ToggleGroup.Item>,
  SegmentButtonProps
>(({ children, active, size = '32', type = 'grey', ...itemProps }, ref) => (
  <ToggleGroup.Item
    {...itemProps}
    ref={ref}
    className={segmentStyles({ active, variant: 'default', size, type })}
  >
    {children}
  </ToggleGroup.Item>
))

Button.displayName = 'Button'

export const IconButton = forwardRef<
  React.ElementRef<typeof ToggleGroup.Item>,
  SegmentButtonProps & {
    icon: IconElement
    type?: 'grey' | 'dark-grey'
  }
>(
  (
    { icon, children, active, size = '32', type = 'grey', ...itemProps },
    ref,
  ) => {
    const iconWithColor = cloneElement(icon, {
      className: cx([
        'size-5 text-neutral-50 dark:text-white-40',
        active && '!text-white-100',
      ]),
    })

    return (
      <ToggleGroup.Item
        {...itemProps}
        ref={ref}
        className={segmentStyles({
          active,
          variant: children ? 'icon' : 'icon-only',
          size,
          type,
        })}
      >
        {iconWithColor}
        {children}
      </ToggleGroup.Item>
    )
  },
)

IconButton.displayName = 'IconButton'

export const EmojiButton = forwardRef<
  React.ElementRef<typeof ToggleGroup.Item>,
  SegmentButtonProps & {
    emoji: string
    value?: string | number
    type?: 'grey' | 'dark-grey'
  }
>(
  (
    { children, emoji, active, size = '32', type = 'grey', ...itemProps },
    ref,
  ) => (
    <ToggleGroup.Item
      {...itemProps}
      ref={ref}
      className={segmentStyles({
        active,
        variant: children ? 'emoji' : 'emoji-only',
        size,
        type,
      })}
    >
      {emoji} {children}
    </ToggleGroup.Item>
  ),
)

EmojiButton.displayName = 'EmojiButton'

type TabVariants = VariantProps<typeof tabContainerStyles>

interface CustomProps {
  type?: TabVariants['type']
  size?: TabVariants['size']
}

// Use Omit to remove the 'type' prop from ToggleGroupSingleProps
// Use Omit to remove the 'type' prop from ToggleGroupSingleProps
type RootProps = Omit<ToggleGroup.ToggleGroupSingleProps, 'type'> & CustomProps

const TabsContext = createContext<Pick<RootProps, 'size' | 'type'>>({})

export const Root = (props: RootProps) => {
  const { children, size = '32', type = 'grey', ...rootProps } = props

  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const activeSegment = segmentRefs.current.find(
      segment => segment?.getAttribute('data-state') === 'on',
    )

    if (activeSegment) {
      setIndicatorStyle({
        width: activeSegment.offsetWidth,
        transform: `translateX(${activeSegment.offsetLeft}px)`,
      })
    }
  }, [children])

  const clonedChildren = useMemo(() => {
    return Children.map(children, (child, index) => {
      if (!isValidElement<SegmentButtonProps>(child)) return child

      return cloneElement(child, {
        ref: (el: HTMLButtonElement | null) => {
          segmentRefs.current[index] = el
        },
        active: child.props.value === props.value,
        size,
        type,
      })
    })
  }, [children, props.value, size, type])

  return (
    <TabsContext.Provider value={useMemo(() => ({ size, type }), [size, type])}>
      <ToggleGroup.Root
        {...rootProps}
        type="single"
        className={tabContainerStyles({ size, type })}
      >
        <div
          className={activeTabStyles({ size, type })}
          style={indicatorStyle}
        />
        {clonedChildren}
      </ToggleGroup.Root>
    </TabsContext.Provider>
  )
}
