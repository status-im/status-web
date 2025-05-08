'use client'

import { useState } from 'react'

import { cx } from 'class-variance-authority'

import { getColorWithOpacity } from '../_utils/get-color-with-opacity'

type Props = {
  variant?: 'internal' | 'external'
  onClick?: () => void
  label: string
  color?: `#${string}` | string
}

export function Tag(props: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const { variant = 'external', onClick, label, color } = props

  // Define variant-specific styles
  const variantStyles = {
    internal: {
      default: {
        backgroundColor: getColorWithOpacity(color, 0.1),
        color,
        borderColor: getColorWithOpacity(color, 0.2),
      },
      hover: {
        backgroundColor: getColorWithOpacity(color, 0.2),
        borderColor: getColorWithOpacity(color, 0.3),
      },
      active: {
        backgroundColor: getColorWithOpacity(color, 0.2),
        borderColor: getColorWithOpacity(color, 0.4),
      },
    },
    external: {
      default: {
        backgroundColor: 'transparent',
        color,
        borderColor: getColorWithOpacity(color, 0.2),
      },
      hover: {
        backgroundColor: getColorWithOpacity(color, 0.1),
        borderColor: getColorWithOpacity(color, 0.3),
      },
      active: {
        backgroundColor: getColorWithOpacity(color, 0.1),
        borderColor: getColorWithOpacity(color, 0.4),
      },
    },
  }

  // Determine the variant-specific styles based on the variant prop
  const variantStyle = variantStyles[variant] || {}
  const hoverStyle = variantStyle.hover || {}
  const activeStyle = variantStyle.active || {}

  return (
    <div
      className={cx(
        'flex h-6 items-center rounded-[24px] border px-2 transition-all duration-200',
        !onClick && 'pointer-events-none select-none'
      )}
      style={{
        ...variantStyle.default,
        ...(isHovered && hoverStyle),
        ...(isActive && activeStyle),
      }}
      {...(onClick && {
        role: 'button',
        onClick,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onMouseDown: () => setIsActive(true),
        onMouseUp: () => setIsActive(false),
      })}
    >
      <span
        className="text-13 font-medium"
        style={{ color: variantStyle.default.color }}
      >
        {label}
      </span>
    </div>
  )
}
