import { cva, type VariantProps } from 'cva'

import { mapColorToken } from '../utils/color-tokens'

import type { ColorToken } from '../utils/color-tokens'

const styles = cva({
  variants: {
    type: {
      default: 'font-sans',
      monospace: 'font-mono',
    },
    size: {
      88: 'text-88',
      64: 'text-64',
      40: 'text-40',
      27: 'text-27',
      19: 'text-19',
      15: 'text-15',
      13: 'text-13',
      11: 'text-11',
    },
    weight: {
      regular: 'font-regular',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    uppercase: {
      true: 'uppercase',
    },
    wrap: {
      false: 'whitespace-nowrap',
    },
    truncate: {
      true: 'truncate',
    },
    select: {
      false: 'select-none',
    },
  },
  defaultVariants: {
    type: 'default',
    weight: 'regular',
  },
})

type Props<C extends React.ElementType> = VariantProps<typeof styles> &
  React.ComponentPropsWithoutRef<C> & {
    as?: C
    color?: ColorToken
  }

const Text = <C extends React.ElementType = 'span'>(props: Props<C>) => {
  const {
    as: Component = 'span',
    color,
    size,
    weight,
    uppercase,
    wrap,
    truncate,
    select,
    children,
    className,
    ...rest
  } = props

  return (
    <Component
      {...rest}
      className={styles({
        size,
        weight,
        uppercase,
        wrap,
        truncate,
        select,
        className: color ? mapColorToken(color) + ' ' + className : className,
      })}
    >
      {children}
    </Component>
  )
}

export { Text }
export type { Props as TextProps }
