import { Children, cloneElement } from 'react'

import { cx } from 'class-variance-authority'

export function renderText(params: {
  children: React.ReactNode | React.ReactNode[]
  size?: string
  weight?: string
  color?: string
  parent?: string
}) {
  const {
    children,
    size = 'text-19',
    weight = 'font-regular',
    color = 'text-neutral-100',
    parent,
  } = params

  return Children.map(children, child => {
    if (typeof child === 'string') {
      return (
        <span
          className={cx(
            size,
            weight,
            color
            // 'break-word hyphens-manual break-all'
          )}
        >
          {child}
        </span>
      )
    }

    if (parent) {
      return cloneElement(child as any, { parent })
    }

    return child
  })
}
