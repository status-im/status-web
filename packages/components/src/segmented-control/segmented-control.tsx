import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react'

import { cva } from 'cva'

import type { ReactElement, ReactNode } from 'react'

const tabContainerStyles = cva({
  base: [
    'relative inline-flex items-center justify-center gap-0.5 rounded-10 bg-neutral-10 p-0.5',
  ],

  variants: {
    type: {
      grey: 'bg-neutral-10',
      'dark-grey': 'bg-neutral-20',
    },
    size: {
      24: 'h-6',
      32: 'h-8',
    },
  },
})

const tabStyles = cva({
  base: [
    'absolute left-0 rounded-8 bg-neutral-50 transition-all duration-300 ease-out',
  ],
  variants: {
    size: {
      24: 'h-[20px]',
      32: 'h-[28px]',
    },
  },
})

const segmentStyles = cva({
  base: [
    'relative z-10 flex select-none items-center font-medium transition-all duration-300 ease-out',
  ],
  variants: {
    active: {
      true: 'text-white-100',
      false: 'bg-transparent text-neutral-80',
    },
    variant: {
      default: '',
      emoji: '',
      icon: 'gap-1',
    },
    size: {
      24: 'text-13',
      32: 'text-15',
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      size: 24,
      className: 'px-2',
    },
    {
      variant: 'default',
      size: 32,
      className: 'px-3',
    },
    {
      variant: 'emoji',
      size: 24,
      className: 'pl-[6px] pr-2',
    },
    {
      variant: 'emoji',
      size: 32,
      className: 'pl-[10px] pr-3',
    },
    {
      variant: 'icon',
      size: 24,
      className: 'pl-[6px] pr-2',
    },
    {
      variant: 'icon',
      size: 32,
      className: 'pl-[10px] pr-3',
    },
  ],
})

type SegmentButtonProps = {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  size?: 24 | 32
}

const Button = forwardRef<HTMLButtonElement, SegmentButtonProps>(
  ({ children, onClick, active, size = 32 }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={segmentStyles({ active, variant: 'default', size })}
    >
      {children}
    </button>
  ),
)

Button.displayName = 'Button'

const IconButton = forwardRef<
  HTMLButtonElement,
  SegmentButtonProps & { icon: ReactNode }
>(({ children, icon, onClick, active, size = 32 }, ref) => {
  const iconWithCurrentColor = cloneElement(icon as ReactElement, {
    color: 'currentColor',
  })

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={segmentStyles({ active, variant: 'icon', size })}
    >
      {iconWithCurrentColor}
      {children}
    </button>
  )
})

IconButton.displayName = 'IconButton'

const EmojiButton = forwardRef<
  HTMLButtonElement,
  SegmentButtonProps & { emoji: string }
>(({ children, emoji, onClick, active, size = 32 }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={segmentStyles({ active, variant: 'emoji', size })}
  >
    {emoji} {children}
  </button>
))

EmojiButton.displayName = 'EmojiButton'

type Props<T> = {
  children: ReactNode
  activeSegment: T
  onSegmentChange: (value: T) => void
  size?: 24 | 32
  type?: 'grey' | 'dark-grey'
}

const SegmentedControl = <T extends string | number>(props: Props<T>) => {
  const {
    children,
    activeSegment,
    onSegmentChange,
    size = 32,
    type = 'grey',
  } = props

  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const activeSegmentIndex = Children.toArray(children).findIndex(
      child => isValidElement(child) && child.props.children === activeSegment,
    )

    const activeSegmentRef = segmentRefs.current[activeSegmentIndex]
    if (activeSegmentRef) {
      setIndicatorStyle({
        width: `${activeSegmentRef.offsetWidth}px`,
        transform: `translateX(${activeSegmentRef.offsetLeft}px)`,
      })
    }
  }, [activeSegment, children])

  const clonedChildren = Children.map(
    children,
    (child, index) =>
      isValidElement(child) &&
      cloneElement(child, {
        ...child.props,
        onClick: () => onSegmentChange(child.props.children),
        active: child.props.children === activeSegment,
        ref: (el: HTMLButtonElement) => (segmentRefs.current[index] = el),
        size,
      }),
  )

  return (
    <div className={tabContainerStyles({ size, type })}>
      <div className={tabStyles({ size })} style={indicatorStyle} />
      {clonedChildren}
    </div>
  )
}

SegmentedControl.Root = SegmentedControl
SegmentedControl.Button = Button
SegmentedControl.IconButton = IconButton
SegmentedControl.EmojiButton = EmojiButton

export { SegmentedControl }
